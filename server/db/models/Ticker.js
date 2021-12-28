const Sequelize = require('sequelize')
const db = require('../db')

const Ticker = db.define('ticker', {
    symbol: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING
    }
})

module.exports = Ticker