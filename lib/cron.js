import cron from 'node-cron';
import { runCron } from './scraper';

// Lun-Vie de 9 a 15
cron.schedule(
  '0 10-15 * * 1,2,3,4,5',
  () => {
    console.log('Running Cron Lun-Vie 10-15 ART');
    runCron();
  },
  {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires',
  }
);
