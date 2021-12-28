const Sequelize = require('sequelize')
const db = require('../db')

const Price = db.define('price', {
    open: {
        type: Sequelize.FLOAT
    },
    high: {
        type: Sequelize.FLOAT
    },
    low: {
        type: Sequelize.FLOAT
    },
    close: {
        type: Sequelize.FLOAT
    },
    adjustedClose: {
        type: Sequelize.FLOAT
    },
    volume: {
        type: Sequelize.FLOAT
    }
})

module.exports = Price