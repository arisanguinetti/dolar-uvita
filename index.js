import express from 'express'
import { findUVAValue, findUSDValue } from "./lib/scraper";
import db from './lib/db'

const app = express();

app.get('/scrape', async (req, res, next) => {
    const [uvaValue, usdValue] = await Promise.all([
        findUVAValue(), findUSDValue()
    ]);

    db.get('uvaValues').push({
        date: Date.now(),
        value: uvaValue
    }).write()
    db.get('usdValues').push({
        date: Date.now(),
        value: usdValue
    }).write()

    console.log('Valor UVA: ' + uvaValue)
    console.log('Valor USD: ' + usdValue)

    res.json({ uvaValue, usdValue });
})

const PORT = process.env.port || 2093;

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});
