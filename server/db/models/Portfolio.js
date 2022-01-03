const Sequelize = require('sequelize')
const db = require('../db')

const Portfolio = db.define('portfolio', {
    weight: {
        type: Sequelize.FLOAT
    },
    portGroup: {
        type: Sequelize.STRING
    }
})

module.exports = Portfolio