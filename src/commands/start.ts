// import cron from 'node-cron';

// import logger from './logger';
// import backupScript from './backup';
// import { containers } from './containers';

// logger('Script started. Scheduling cron job...');

// // run every 3 hours
// cron.schedule('0 */3 * * *', async () => {
// 	logger('Cron job started at:', new Date().toLocaleString());

// 	logger('Running backup script...');

// 	await backupScript(containers);

// 	logger('Backup script completed.');
// });

export async function start() {
	console.log('start() has not been implemented yet!');
}
