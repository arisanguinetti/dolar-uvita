const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { UvaModel, UsdModel, UsdUvaModel } = require('./models');
const { connectDB } = require('./db');

connectDB()
  .then(() => {
    const adapter = new FileSync('db.json');
    const lowdb = low(adapter);

    UvaModel.deleteMany({}, () => {
      const uvaValues = lowdb.get('uvaValues').value();

      const promisesUva = uvaValues.map(el => {
        const { date, value } = el;
        const uva = new UvaModel({
          date,
          value,
        });
        return uva.save();
      });

      Promise.all(promisesUva)
        .then(resolved => {
          resolved.map(obj => console.log(`Saved obj: ${obj.dateFormatted}`));
        })
        .catch(err => console.log(err));
    });

    UsdModel.deleteMany({}, () => {
      const usdValues = lowdb.get('usdValues').value();

      const promisesUsd = usdValues.map(el => {
        const {
          date,
          value: { comprador, vendedor },
        } = el;
        const usd = new UsdModel({
          date,
          comprador,
          vendedor,
        });
        return usd.save();
      });

      Promise.all(promisesUsd)
        .then(resolved => {
          resolved.map(obj => console.log(`Saved obj: ${obj.dateFormatted}`));
        })
        .catch(err => console.log(err));
    });

    UsdUvaModel.deleteMany({}, () => {
      const usdUvaValues = lowdb.get('uvaUsdValues').value();

      const promisesUsdUva = usdUvaValues.map(el => {
        const {
          date,
          value: { comprador, vendedor },
        } = el;
        const usd = new UsdUvaModel({
          date,
          comprador,
          vendedor,
        });
        return usd.save();
      });

      Promise.all(promisesUsdUva)
        .then(resolved => {
          resolved.map(obj => console.log(`Saved obj: ${obj.dateFormatted}`));
        })
        .catch(err => console.log(err));
    });
  })
  .catch(err => console.log(err));
