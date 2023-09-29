#!/usr/bin/env node

import { Command } from 'commander';
import { shell } from './utils/shell.js';
import { add } from './commands/add.js';
import { remove } from './commands/remove.js';
import { status } from './commands/status.js';
import { scan } from './commands/scan.js';
import { log } from './commands/log.js';
import { stop } from './commands/stop.js';
import { restore } from './commands/restore.js';
import { Database as db } from './utils/database.js';

const program = new Command();

program.name('capdb').description('database management cli for caprover').version(1);

program
	.command('add')
	.description('add containers database credentials to backup')
	.option('-c, --container <string>', 'container name')
	.option('-t, --type <string>', 'databse type (mysql, postgres, redis, mongodb)')
	.option('-n, --name <string>', 'database name')
	.option('-u, --username <string>', 'database username')
	.option('-p, --password <string>', 'database password')
	.option('-f, --frequency <number>', 'database backup frequency')
	.action(async (cmd) => await add(cmd));

program
	.command('remove')
	.description('remove containers database credentials to backup')
	.option('-id, --id <string>', 'the id')
	.option('-a, --all', 'remove all')
	.action(async (cmd) => remove(cmd));

program
	.command('start')
	.description('start the cron job to backup all the databases inside docker containers')
	.action(async () => {
		let lists = await db.getAll();

		console.log();

		if (lists.length === 0) {
			console.error('There is nothing in the list!');
			console.log();
			return;
		}

		(async () => await shell('./src/scripts/start.sh'))();
	});

program
	.command('restore')
	.description('Retore the dump sql to back to the database container')
	.action(restore);

program.command('status').description('list all the scheduled containers databases').action(status);

program.command('log').description('log all the backup activities').action(log);

program.command('stop').description('stop capdb backup scheduler').action(stop);

program.command('scan').description('scan all the available running containers').action(scan);

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
