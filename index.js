const express = require('express');
const cors = require('cors');
const db = require('./lib/db');
require('./lib/cron');
const asyncHandler = require('./lib/asyncHandler');
const { uniqueCount, uniqueCountObjects, sortObject } = require('./lib/utils');

const app = express();

app.use(cors());

app.get(
  '/data',
  asyncHandler(async (req, res, next) => {
    const { uvaValues, usdValues, uvaUsdValues } = db.value();

    const uva = uniqueCount(uvaValues);
    const usd = uniqueCountObjects(usdValues);
    const uvaUsd = uvaUsdValues.sort(sortObject);

    return res.json({
      uva,
      usd,
      uvaUsd,
    });
  })
);

const PORT = process.env.port || 2093;

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
