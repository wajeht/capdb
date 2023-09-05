#!/usr/bin/env node

// import cron from 'node-cron';

// import logger from './logger';
// import backupScript from './backup';
// import { containers } from './containers';

// logger.info('Script started. Scheduling cron job...');

// // run every 3 hours
// cron.schedule('0 */3 * * *', async () => {
// 	logger.info('Cron job started at:', new Date().toLocaleString());

// 	logger.info('Running backup script...');

// 	await backupScript(containers);

// 	logger.info('Backup script completed.');
// });

import { Command } from 'commander';
import { version } from '../package.json';
import { add, list, start, remove } from './commands';

const program = new Command();

// prettier-ignore
program.name('capdb')
	.description('database management cli for caprover')
	.version(version);

// prettier-ignore
program
	.command('add')
	.description('add containers database credentials to backup')
	.action(add);

// prettier-ignore
program
	.command('remove')
	.description('remove containers database credentials to backup')
	.action(remove);

// prettier-ignore
program
	.command('start')
	.description('start the cron job to backup all the databases inside docker containers')
	.action(start);

// prettier-ignore
program
	.command('list')
	.description('list all the scheduled containers databases')
	.action(list);

if (process.argv.length < 3) {
	program.help();
}

program.parse(process.argv);
