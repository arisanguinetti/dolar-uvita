import express from 'express';
import cors from 'cors';
import { findUVAValue, findUSDValue } from './lib/scraper';
import db from './lib/db';
import './lib/cron';
import { uniqueCount, uniqueCountObjects, sortObject } from './lib/utils';

const app = express();

app.use(cors());

app.get('/scrape', async (req, res, next) => {
  const [uvaValue, usdValue] = await Promise.all([
    findUVAValue(),
    findUSDValue(),
  ]);

  res.json({ uvaValue, usdValue });
});

app.get('/data', async (req, res, next) => {
  const { uvaValues, usdValues, uvaUsdValues } = db.value();

  const uva = uniqueCount(uvaValues);
  const usd = uniqueCountObjects(usdValues);
  const uvaUsd = uvaUsdValues.sort(sortObject);

  return res.json({
    uva,
    usd,
    uvaUsd,
  });
});

const PORT = process.env.port || 2093;

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
