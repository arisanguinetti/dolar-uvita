const cron = require('node-cron');
const moment = require('moment-timezone');
const { connectDB } = require('./lib/db');
const { runCron } = require('./lib/scraper');

moment.locale('es');

const doCron = () => {
  const now = moment().tz('America/Argentina/Buenos_Aires');
  console.log(`Running Cron Lun-Vie 10-15 ART: ${now.toISOString()}`);
  try {
    runCron();
  } catch (error) {
    console.error(error);
  }
};

connectDB()
  .then(() => {
    cron.schedule('0 10-15 * * 1,2,3,4,5', doCron, {
      scheduled: true,
      timezone: 'America/Argentina/Buenos_Aires',
    });
    runCron();
  })
  .catch(err => console.log(err));
