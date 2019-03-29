import cron from 'node-cron'
import {runCron} from './scraper'

cron.schedule('0 * * * *', () => {
    console.log('running a task every hour');
    runCron();
  });