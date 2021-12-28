'use strict'

const {db, models: {User, Ticker, DataDate, Price} } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')

  // Creating Users
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ])

  console.log(`seeded ${users.length} users`)

  // Creating Tickers
  const tickers = await Promise.all([
    Ticker.create({ symbol: 'FZROX', description: 'Fidelity ZERO Total Market Index Fund' }),
    Ticker.create({ symbol: 'FSKAX', description: 'Fidelity Total Market Index Fund' }),
    Ticker.create({ symbol: 'FZILX', description: 'Fidelity ZERO International Index Fund' }),
    Ticker.create({ symbol: 'FTIHX', description: 'Fidelity Total International Index Fund' }),
    Ticker.create({ symbol: 'FXNAX', description: 'Fidelity U.S. Bond Index Fund' }),
    Ticker.create({ symbol: 'VTSAX', description: 'Vanguard Total Stock Market Index Fund Admiral Shares' }),
    Ticker.create({ symbol: 'VTIAX', description: 'Vanguard Total International Stock Index Fund Admiral Shares' }),
    Ticker.create({ symbol: 'VBTLX', description: 'Vanguard Total Bond Market Index Fund Admiral Shares' }),
    Ticker.create({ symbol: 'SWTSX', description: 'Schwab Total Stock Market Index Fund' }),
    Ticker.create({ symbol: 'SWISX', description: 'Schwab International Index Fund' }),
    Ticker.create({ symbol: 'SWAGX', description: 'Schwab U.S. Aggregate Bond Index Fund' }),
  ])

  console.log(`seeded ${tickers.length} tickers`)

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
