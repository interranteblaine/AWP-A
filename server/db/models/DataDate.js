const Sequelize = require('sequelize')
const db = require('../db')

const DataDate = db.define('datadate', {
    date: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
})

module.exports = DataDate