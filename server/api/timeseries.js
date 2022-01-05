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
        if (!data) {
            const error = new Error("Time series data not found");
            error.stack = 404;
            next(error);
        } else {

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

            const getGroups = (flatDataTable) => {
                const groups = flatDataTable.reduce((acc, d) => {
                    if (!acc[d.portGroup]) {
                        acc[d.portGroup] = [d.symbol];
                    } else if (!acc[d.portGroup].includes(d.symbol)) {
                        acc[d.portGroup].push(d.symbol);
                    }
                    return acc;
                }, {})
                return groups
            }

            const groupAndSortData = (flatDataTable, portGroup, symbol, startBalance) => {
                const groupSortArr = flatDataTable
                                    .filter(d => d.portGroup === portGroup)
                                    .filter(d => d.symbol === symbol)
                                    .sort((a, b) => a.date > b.date ? 1 : -1);
                const shares = startBalance * groupSortArr[0].weight / groupSortArr[0].adjustedClose;
                return groupSortArr.reduce((acc, d) => {
                    acc.push({ date: d.date, [symbol]: shares * d.adjustedClose })
                    return acc;
                }, []);
            }

            // {date: '', symbol1: value, symbolN....}
            const constructTable = (data) => {
                const startBalance = 6000;
                const flatTable = flattenDataTable(data);
                const groups = getGroups(flatTable);
                
                // think through groupTable to combine from like portGroups

                const groupTable = groupAndSortData(flatTable, 'A', 'FTIHX', startBalance);
                return groupTable;
            }

            const result = constructTable(data)

            res.json(result);
        }
    } catch (error) {
        next(error)
    }
})