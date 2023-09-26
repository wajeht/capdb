#!/usr/bin/env node

import { Command } from 'commander';
import { list, add, remove, restore, scan } from './commands';
import { shell, version } from './utils';

const program = new Command();

program.name('capdb').description('database management cli for caprover').version(version);

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
		(async () => await shell('./src/scripts/start.sh'))();
	});

// prettier-ignore
program.command('list')
	.description('list all the scheduled containers databases')
	.action(list);

// prettier-ignore
program.command('scan')
	.description('scan all the available running containers')
	.action(scan);

program
	.command('restore')
	.description('Retore the dump sql to back to the container')
	.action(restore);

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
