import express from 'express';
import { findUVAValue, findUSDValue } from './lib/scraper';
import './lib/db';
import './lib/cron';

const app = express();

app.get('/scrape', async (req, res, next) => {
  const [uvaValue, usdValue] = await Promise.all([
    findUVAValue(),
    findUSDValue(),
  ]);

  res.json({ uvaValue, usdValue });
});

const PORT = process.env.port || 2093;

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
