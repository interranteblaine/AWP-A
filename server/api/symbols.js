const router = require('express').Router()
const { models: { Ticker, Price, DataDate }} = require('../db')
const { requireToken } = require('./gateKeepingMiddleware')
module.exports = router

router.get('/', requireToken, async (req, res, next) => {
    try {
        const tickerSymbols = await Ticker.findAll({
            attributes: ['id', 'symbol']
        });
        res.json(tickerSymbols);
    } catch (error) {
        next(error)
    }
})

router.get('/:id', requireToken, async (req, res, next) => {
    try {
        const tickerData = await Ticker.findByPk(req.params.id, {
            attributes: ['id', 'symbol', 'description'],
            include: {
                model: Price,
                attributes: ['id', 'adjustedClose'],
                include: {
                    model: DataDate,
                    attributes: ['id', 'date']
                }
            }
        });
        if (!tickerData) {
            const error = new Error("Ticker not found");
            error.status = 404;
            next(error);
        } else {
            res.json(tickerData);
        }
    } catch (error) {
        next(error)
    }
})