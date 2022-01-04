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
            const transformedData = [];
            for (let i = 0; i < data.length; i++) {
                let portItem = data[i];
                let { weight, portGroup, ticker: { symbol, prices } } = portItem;
                for (let j = 0; j < prices.length; j++) {
                    let priceItem = prices[j];
                    let { adjustedClose, datadate: { date } } = priceItem;
                    transformedData.push({date, symbol, adjustedClose, weight, portGroup});
                }
            }
            res.json(transformedData);
        }
    } catch (error) {
        next(error)
    }
})