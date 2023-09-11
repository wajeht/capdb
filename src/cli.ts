#!/usr/bin/env node

import { Command } from 'commander';
import { list, add, start, remove } from './commands';
import { version } from './utils';

const program = new Command();

program.name('capdb').description('database management cli for caprover').version(version);

program
	.command('add')
	.description('add containers database credentials to backup')
	.option('-c, --container <string>', 'container name')
	.option('-u, --username <string>', 'database username')
	.option('-d, --database <string>', 'database name')
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
	.action(start);

program.command('list').description('list all the scheduled containers databases').action(list);

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
