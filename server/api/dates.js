const router = require('express').Router()
const { models: { DataDate }} = require('../db')
const { requireToken } = require('./gateKeepingMiddleware')
module.exports = router

router.get('/', requireToken, async (req, res, next) => {
    try {
        const dates = await DataDate.findAll({
            attributes: ['id', 'date']
        });
        res.json(dates);
    } catch (error) {
        next(error)
    }
})