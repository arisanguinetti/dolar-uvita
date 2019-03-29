import cron from 'node-cron'
import {runCron} from './scraper'

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    runCron();
  });