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

import {
	input,
	// confirm
} from '@inquirer/prompts';
import { Command } from 'commander';
import { version } from '../package.json';
import {
	// list,
	// add,
	start,
	remove,
} from './commands';
import Database from './utils/database';

const db = new Database();

const program = new Command();

// prettier-ignore
program.name('capdb')
  .description('database management cli for caprover')
  .version(version);

program
	.command('add')
	.description('add containers database credentials to backup')
	.option('-c, --container <string>', 'container name')
	.option('-u, --username <string>', 'database username')
	.option('-d, --database <string>', 'database name')
	.action(async (cmd) => {
		let { container, username, database } = cmd;

		let modify = undefined;

		let sure = false;

		if (!container || !username || !database) {
			while (sure === false) {
				if (!container) {
					container = await input({
						message: 'Enter container name',
						validate: (value) => value.length !== 0,
					});
				}

				if (!database) {
					database = await input({
						message: 'Enter database name',
						validate: (value) => value.length !== 0,
					});
				}

				if (!username) {
					username = await input({
						message: 'Enter database username',
						validate: (value) => value.length !== 0,
					});
				}

				console.table({ container, username, database });

				// sure = await confirm({ message: 'are you sure?' })

				sure =
					(await input({
						message: 'Are you sure these are the correct information? (y/n)',
						validate: (value) => value === 'y' || value === 'n',
					})) === 'y'
						? true
						: false;

				if (!sure) {
					modify = await input({
						message: 'what do you want to chagne? database (u), container (c), username (u) ?',
						validate: (value) => ['c', 'u', 'd'].includes(value) === true,
					});

					container = modify === 'c' ? '' : container;
					username = modify === 'u' ? '' : username;
					database = modify === 'd' ? '' : database;
				}
			}
		}

		db.add({
			container_name: container,
			database_name: database,
			database_username: username,
		});

		console.log('The following credentials have been added.');

		console.table({ container, username, database });
	});

// prettier-ignore
program
  .command('remove')
  .description('remove containers database credentials to backup')
	.option('-id, --id <string>', 'id')
  .action(async (cmd) => {
		let { id } = cmd

		if (!id) {
			id = await input({
				message: 'Enter id',
				validate: (value) => value.length !== 0,
			});
		}

		db.remove(id);
	});

// prettier-ignore
program
  .command('start')
  .description('start the cron job to backup all the databases inside docker containers')
  .action(start);

program
	.command('list')
	.description('list all the scheduled containers databases')
	.action(() => {
		const list = db.getData();

		if (list.length === 0) {
			return console.error('Empty!');
		}

		console.table(list);
	});

if (process.argv.length < 3) {
	program.help();
}

program.parse(process.argv);
