const axios = require('axios');
const fs = require('fs');

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

const loadJSON = (filename = '') => {
    return JSON.parse(
        fs.existsSync(filename)
            ? fs.readFileSync(filename).toString()
            : '""'
    )
}

const saveJSON = (filename = '', json = "''") => {
    return fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}

const tickerSymbols = ['FZROX', 'FSKAX', 'FZILX', 'FTIHX', 'FXNAX', 'VTSAX', 'VTIAX', 'VBTLX', 'SWTSX', 'SWISX', 'SWAGX'];

const priceDataJSON = 'priceData.json';

const savePriceInfo = async (tickersArr) => {
    try {
        const promises = await Promise.all(tickersArr.map(async (ticker) => {
                let apiUrl = generateApiUrl(ticker);
                let { data } = await axios.get(apiUrl);
                return {
                    symbol: ticker,
                    data
                };
            }
        ));

        await saveJSON(priceDataJSON, promises)
    
        return;
    } catch (error) {
        console.log(error)    
    }
}

savePriceInfo(tickerSymbols);


