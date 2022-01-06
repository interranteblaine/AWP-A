const router = require('express').Router()
const { models: { Portfolio, Ticker, Price, DataDate }} = require('../db')
const { requireToken } = require('./gateKeepingMiddleware')
module.exports = router

router.get('/:userId', requireToken, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const data = await Portfolio.findAll({
            where: {
                userId: userId
            },
            attributes: ['weight', 'portGroup'],
            include: {
                model: Ticker,
                attributes: ['symbol'],
                include: {
                    model: Price,
                    attributes: ['adjustedClose'],
                    include: {
                        model: DataDate,
                        attributes: ['date'],
                    }
                }
            }
        });
        if (!data.length) {
            const error = new Error("Time series data not found");
            error.stack = 404;
            next(error);
        } else {
            // flatten date table for easier access to nested arrays / objects
            const flattenDataTable = (data) => {
                const flatDataTable = [];
                for (let i = 0; i < data.length; i++) {
                    let portItem = data[i];
                    let { weight, portGroup, ticker: { symbol, prices } } = portItem;
                    for (let j = 0; j < prices.length; j++) {
                        let priceItem = prices[j];
                        let { adjustedClose, datadate: { date } } = priceItem;
                        flatDataTable.push({date, symbol, adjustedClose, weight, portGroup});
                    }
                }
                return flatDataTable;
            }
            // helper function to get unique dates and groups
            const getUniqueItems = (flatDataTable, key) => {
                const result = flatDataTable.reduce((a, d) => {
                    if (!a[d[key]]) a[d[key]] = 1;
                    return a;
                }, {});
                return Object.keys(result);
            } 
            // helper function to parse dates from YYYY-MM-DD to Date Objects to sort/find min date
            const parseDate = (dateStr) => {
                let d = dateStr.split('-');
                return new Date(d[0], d[1] - 1, d[2]); // month is 0-indexed
            }
            // Calculates shares and current value, and transforms data into "client-format" 
            const calcAssetValues = (flatDataTable, startBalance) => {
                const balance = startBalance;
                const groups = getUniqueItems(flatDataTable, 'portGroup');
                const dates = getUniqueItems(flatDataTable, 'date');
                const startDate = dates.reduce((a, b) => parseDate(a) < parseDate(b) ? a : b);
                // dateGroupPrice = [{date: 'YYYY-MM-DD', group: 'K'}, {...}, ...]
                const dateGroupPrice = dates.reduce((a, date) => {
                    groups.forEach(group => {
                        a.push({ date, group });
                    });
                    return a;
                }, []);
                // shares = { A: {}, B: {}, ...}
                const shares = groups.reduce((a, b) => {
                    if (!a[b]) a[b] = {};
                    return a;
                }, {});
                // Modifies dateGroupPrice table to include prices and asset allocation weights
                // Adds the quantity of shares for each asset within each group to the shares object
                // shares = balance * weight / adjustedClose
                for (let i = 0; i < flatDataTable.length; i++) {
                    let item = flatDataTable[i];
                    if (item.date === startDate) {
                        shares[item.portGroup][item.symbol] = balance * item.weight / item.adjustedClose;
                    }
                    for (let j = 0; j < dateGroupPrice.length; j++) {
                        let dGP = dateGroupPrice[j];
                        if (dGP.date === item.date && dGP.group === item.portGroup) {
                            dGP[item.symbol] = {
                                price: item.adjustedClose,
                                weight: item.weight
                            }
                        }
                    }
                }
                // adds the shares and value to each asset in datePriceGroup
                dateGroupPrice.forEach(d => {
                    let group = d.group;
                    let totalValue = 0;
                    for (let key in d) {
                        if (key !== 'date' && key !== 'group') {
                            d[key].shares = shares[group][key];
                            d[key].value = shares[group][key] * d[key].price;
                            totalValue += shares[group][key] * d[key].price;
                        }
                    }
                    d.totalValue = totalValue;
                });
                // adds asset allocation to each asset
                dateGroupPrice.forEach(d => {
                    let totalValue = d.totalValue;
                    for (let key in d) {
                        if (key !== 'date' && key !== 'group' && key !== 'totalValue') {
                            d[key].allocation = d[key].value / totalValue;
                        }
                    }
                });
                // return data table that is sorted on date ASC
                return dateGroupPrice.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
            }
            const constructData = (data) => {
                const startBalance = 6000;
                const flatTable = flattenDataTable(data);
                const transformedData = calcAssetValues(flatTable, startBalance)
                return transformedData;
            }
            res.json(constructData(data));
        }
    } catch (error) {
        next(error)
    }
})