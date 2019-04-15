const express = require('express');
const cors = require('cors');
const { connectDB } = require('./lib/db');
// require('./lib/cron');
const asyncHandler = require('./lib/asyncHandler');
const { UvaModel, UsdModel, UsdUvaModel } = require('./lib/models');
const { uniqueCount, uniqueCountObjects } = require('./lib/utils');

const app = express();

app.use(cors());

app.get(
  '/data',
  asyncHandler(async (req, res, next) => {
    const uvaValues = await UvaModel.getUnique();
    const usdValues = await UsdModel.getUnique();
    const usdUvaValues = await UsdUvaModel.getUnique();

    const uva = uniqueCount(uvaValues);
    const usd = uniqueCountObjects(usdValues);
    const usdUva = uniqueCountObjects(usdUvaValues);

    return res.json({
      uva,
      usd,
      usdUva,
    });
  })
);

const PORT = process.env.port || 2093;

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`App running on http://localhost:${PORT}`);
    })
  )
  .catch(err => console.log(err));
