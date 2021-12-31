'use strict'

const axios = require('axios');
const fs = require('fs');
const {db, models: {User, Ticker, DataDate, Price} } = require('../server/db');
const data = require('./priceData.json');

const priceDataFilename = 'priceData.json';
const tickerSymbols = ['FZROX', 'FSKAX', 'FZILX', 'FTIHX', 'FXNAX', 'VTSAX', 'VTIAX', 'VBTLX', 'SWTSX', 'SWISX', 'SWAGX'];

const generateApiUrl = (tickerSymbol) => {
  const startDate = '2021-01-01'; //YYYY-MM-DD
  const endDate = '2021-12-30'; //YYYY-MM-DD
  const period = 'm'; //d for daily, w for weekly, m for monthly
  const order = 'd'; //d for descending (from new to old), a for ascending
  const format = 'json'; //csv or json
  const apiKey = process.env.APIKEY;
  let symbolName = tickerSymbol;
  let exchangeId = 'US';   
  return `https://eodhistoricaldata.com/api/eod/${symbolName}.${exchangeId}?from=${startDate}&to=${endDate}&period=${period}&fmt=${format}&order=${order}&api_token=${apiKey}`;
}

const saveJSON = (filename = '', json = "''") => {
  return fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}

const savePriceInfo = async (tickersArr) => {
  try {
    const promises = await Promise.all(tickersArr.map(async (ticker) => {
      let apiUrl = generateApiUrl(ticker);
      let { data } = await axios.get(apiUrl);
      return {
        symbol: ticker,
        data
      };
    }));

    saveJSON(priceDataFilename, promises)
  
    return;
  } catch (error) {
    console.log('Save Price Info', error)    
  }
}

const loadPriceInfo = (data) => {
  try {
    const symbolsList = {};
    const datesList = {};
    const priceDataWide = [];
        
    for (let i = 0; i < data.length; i++) {
      let symbol = data[i].symbol;
      if (!symbolsList[symbol]) symbolsList[symbol] = i + 1;
          
      let priceData = data[i].data;
      for (let j = 0; j < priceData.length; j++) {
        let { date, open, high, low, close, adjusted_close, volume } = priceData[j];

        if (!datesList[date]) datesList[date] = j + 1;

        let wideData = {
          symbol,
          date,
          open,
          high,
          low,
          close,
          adjusted_close,
          volume
        };
        priceDataWide.push(wideData);
      }
    }

    const symbols = Object.keys(symbolsList);
    const dates = Object.keys(datesList);

    return { priceDataWide, symbols, dates };
  } catch (error) {
    console.log('Load Price Info', error)
  }
}
/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  const { priceDataWide, symbols, dates } = loadPriceInfo(data);

  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ])

  console.log(`seeded ${users.length} users`)

  // Creating Tickers
  const tickers = await Promise.all(symbols.map(symbol => Ticker.create({ symbol: symbol })))
  console.log(`seeded ${tickers.length} tickers`)
  
  // Creating Dates
  const dataDates = await Promise.all(dates.map(date => DataDate.create({date})))
  console.log(`seeded ${dataDates.length} dates`)

  // Creating price data with associations
  const priceData = await Promise.all(priceDataWide.map(async data => {
    let [date, dateWasCreated] = await DataDate.findOrCreate({where: {date: data.date}});
    let [symbol, tickerWasCreated] = await Ticker.findOrCreate({where: {symbol: data.symbol}});
    return Price.create(
      {
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        adjustedClose: data.adjusted_close,
        volume: data.volume,
        tickerId: symbol.id,
        datadateId: date.id
      }
      )
    }));

  console.log(`seeded ${priceData.length} price data instances`)

  console.log(`seeded successfully`)
  return
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
