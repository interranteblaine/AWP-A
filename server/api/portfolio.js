const router = require('express').Router()
const { models: { Portfolio, Ticker, Price, DataDate }} = require('../db')
const { requireToken } = require('./gateKeepingMiddleware')
module.exports = router

router.post('/', requireToken, async (req, res, next) => {
    try {
        const { userId, symbolId: tickerId, weight, portGroup } = req.body;
        const newItem = await Portfolio.create({
            weight,
            portGroup,
            tickerId,
            userId
        });
        const returnItem = await Portfolio.findByPk(newItem.id, {
            include: {
                model: Ticker,
                attributes: ['id', 'symbol', 'description'],
                include: {
                    model: Price,
                    attributes: ['id', 'adjustedClose'],
                    include: {
                        model: DataDate,
                        attributes: ['id', 'date']
                    }
                }
            },
            attributes: ['id', 'weight', 'portGroup'],
            order: [
                [ Ticker, Price, DataDate, 'date', 'ASC'],
            ]
        });
        res.json(returnItem);
    } catch (error) {
        next(error)
    }
})

router.get('/:userId', requireToken, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const portfolio = await Portfolio.findAll({
            where: {
                userId: userId
            },
            include: {
                model: Ticker,
                attributes: ['id', 'symbol', 'description'],
                include: {
                    model: Price,
                    attributes: ['id', 'adjustedClose'],
                    include: {
                        model: DataDate,
                        attributes: ['id', 'date']
                    }
                }
            },
            attributes: ['id', 'weight', 'portGroup'],
            order: [
                [ Ticker, Price, DataDate, 'date', 'ASC'],
            ]
        });
        if (!portfolio) {
            const error = new Error("Portfolio not found");
            error.stack = 404;
            next(error);
        } else {
            res.json(portfolio);
        }
    } catch (error) {
        next(error)
    }
})

router.delete('/:itemId', requireToken, async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const portfolioItem = await Portfolio.findByPk(itemId, {
            include: {
                model: Ticker,
                attributes: ['id', 'symbol', 'description']
            },
            attributes: ['id', 'weight', 'portGroup']
        });
        if (!portfolioItem) {
            const error = new Error("Portfolio item not found");
            error.status = 404;
            next(error);
        } else {
            await portfolioItem.destroy();
            res.json(portfolioItem);
        }
    } catch (error) {
        next(error)
    }
})