#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Command } from 'commander';

import { shell } from './utils/shell.js';

import { add } from './commands/add.js';
import { remove } from './commands/remove.js';
import { exportt } from './commands/exportt.js';
import { importt } from './commands/importt.js';
import { update } from './commands/update.js';
import { status } from './commands/status.js';
import { scan } from './commands/scan.js';
import { log } from './commands/log.js';
import { config } from './commands/config.js';
import { stop } from './commands/stop.js';
import { restore } from './commands/restore.js';
import { version } from './utils/constants.js';

import db from './database/db.js';

const program = new Command();

program
	.name('capdb')
	.description('database management cli for docker environments')
	.version(version());

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
	.command('update')
	.description('Update containers information')
	.option('-id, --id <string>', 'Specify the ID of the credentials to update')
	.action(async (cmd) => update(cmd));

program
	.command('start')
	.description('Start the scheduled backup process for all configured database containers')
	.action(async () => {
		const containers = await db.select('*').from('containers');

		console.log();

		if (containers.length === 0) {
			console.error('No containers found in the database.');
			console.log();
			process.exit(0);
		}

		(async () => await shell(path.resolve(__dirname, './scripts/start.sh')))();
	});

program
	.command('restore')
	.option('-idx, --index <number>', 'Specify the index of the container to restore')
	.description('Restore a database backup to its respective container')
	.action(async (cmd) => restore(cmd));

program
	.command('config')
	.option('-d, --default', 'Initialize default configuration')
	.option('-u, --update', 'Update capdb configurations')
	.option('-p, --path <string>', 'capdb config folder path')
	.option('-a, --access_key', 's3 access key')
	.option('-s, --secret_key', 's3 secret key')
	.option('-b, --backet_name', 's3 backet name')
	.option('-r, --region', 's3 region')
	.option('-rm, --remove-all', 'remove all capdb configuration')
	.description('Configuration needed for capdb functionality')
	.action(async (cmd) => config(cmd));

program
	.command('export')
	.description('Export all the capdb config as json to desktop')
	.action(exportt);

program
	.command('import')
	.option('-f, --file <string>', 'Specify the file path to import')
	.description('Import all the capdb config from a json file')
	.action(async (cmd) => importt(cmd));

program.command('status').description('List all scheduled container databases').action(status);

program.command('list').description('List all scheduled container databases').action(status);

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
