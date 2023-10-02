import { input } from '@inquirer/prompts';

import db from '../database/db.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

const capdbDirectory = path.join(os.homedir(), 'capdb');
const backupsDirectory = path.join(capdbDirectory, 'backups');
const logsDirectory = path.join(capdbDirectory, 'logs');

export async function config(cmd) {
	let { path, default: dafault } = cmd;

	const config = await db.from('configurations').returning('*');

	if (config.length === 0) {
		// create default folder structures on --default flag
		if (dafault) {
			if (!fs.existsSync(capdbDirectory)) {
				fs.mkdirSync(capdbDirectory, { recursive: true });
			}

			if (!fs.existsSync(backupsDirectory)) {
				fs.mkdirSync(backupsDirectory, { recursive: true });
			}

			if (!fs.existsSync(logsDirectory)) {
				fs.mkdirSync(logsDirectory, { recursive: true });
			}

			await db.insert({ capdb_config_folder_path: capdbDirectory }).into('configurations');

			console.log();
			console.log(`Default folder structure created at ${capdbDirectory}`);
			console.log();
			process.exit(0);
		}

		while (path === undefined) {
			path = await input({
				message: 'Enter capdb config folder path',
				validate: function (value) {
					if (!fs.existsSync(value)) return 'The directory that you have provided does not exist!';
					return true;
				},
			});
			process.exit(0);
		}

		console.log();
		process.exit(0);
	}

	console.log();
	console.table(config);
	console.log();
	process.exit(0);
}
