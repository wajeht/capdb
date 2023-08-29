import cron from 'node-cron';

import logger from './logger';
import backupScript from './backup';
import { containers } from './containers';

logger.info('Script started. Scheduling cron job...');

// run every 3 hours
cron.schedule('0 */3 * * *', async () => {
	logger.info('Cron job started at:', new Date().toLocaleString());

	logger.info('Running backup script...');

	await backupScript(containers);

	logger.info('Backup script completed.');
});
