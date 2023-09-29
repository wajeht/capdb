#!/usr/bin/env node

import { Command } from 'commander';

import { shell } from './utils/shell.js';

import { add } from './commands/add.js';
import { remove } from './commands/remove.js';
import { status } from './commands/status.js';
import { scan } from './commands/scan.js';
import { log } from './commands/log.js';
import { stop } from './commands/stop.js';

import { Database as db } from './utils/database.js';

const program = new Command();

program.name('capdb').description('CapDB - Database Management CLI for Caprover').version(1);

program
	.command('add')
	.description('Add database credentials for container backup')
	.option('-c, --container <string>', 'Specify the container name')
	.option(
		'-t, --type <string>',
		'Specify the database type (e.g., mysql, postgres, redis, mongodb)',
	)
	.option('-n, --name <string>', 'Specify the database name')
	.option('-u, --username <string>', 'Specify the database username')
	.option('-p, --password <string>', 'Specify the database password')
	.option('-f, --frequency <number>', 'Specify the database backup frequency in minutes')
	.action(async (cmd) => await add(cmd));

program
	.command('remove')
	.description('Remove database credentials from container backup')
	.option('-id, --id <string>', 'Specify the ID of the credentials to remove')
	.option('-a, --all', 'Remove all database credentials from backup')
	.action(async (cmd) => remove(cmd));

program
	.command('start')
	.description('Start the scheduled backup process for all configured database containers')
	.action(async () => {
		let lists = await db.getAll();

		console.log();

		if (lists.length === 0) {
			console.error('There are no databases configured for backup.');
			console.log();
			return;
		}

		(async () => await shell('./src/scripts/start.sh'))();
	});

program
	.command('restore')
	.description('Restore a database backup to its respective container')
	.action(restore);

program.command('status').description('List all scheduled container databases').action(status);

program.command('log').description('View logs of all backup activities').action(log);

program.command('stop').description('Stop the CapDB backup scheduler').action(stop);

program.command('scan').description('Scan and list all available running containers').action(scan);

if (process.argv.length < 3) {
	// prettier-ignore
	console.log(`                     __ __
.----.---.-.-----.--|  |  |--.
|  __|  _  |  _  |  _  |  _  |
|____|___._|   __|_____|_____|
            |__|\n`);

	program.help();
}

program.parse(process.argv);
