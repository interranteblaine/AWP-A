//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Ticker = require('./models/Ticker')
const DataDate = require('./models/DataDate')
const Price = require('./models/Price')

//associations could go here!
Ticker.hasMany(Price);
Price.belongsTo(Ticker);
DataDate.hasMany(Price);
Price.belongsTo(DataDate);

module.exports = {
  db,
  models: {
    User,
    Ticker,
    DataDate,
    Price
  },
}
