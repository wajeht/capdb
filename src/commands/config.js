import { input } from '@inquirer/prompts';
import db from '../database/db.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

const capdbDirectory = path.join(os.homedir(), 'capdb');
const backupsDirectory = path.join(capdbDirectory, 'backups');
const logsDirectory = path.join(capdbDirectory, 'logs');

export async function config(cmd) {
	let { path, default: dafault, update, access_key, secret_key, bucket_name, region } = cmd;

	let sure = false;

	const configurations = await db.from('configurations').returning('*');

	if (configurations.length === 0) {
		// capdb config --default
		if (dafault) {
			[capdbDirectory, backupsDirectory, logsDirectory].forEach((directory) => {
				if (!fs.existsSync(directory)) {
					fs.mkdirSync(directory, { recursive: true });
				}
			});

			await db.insert({ capdb_config_folder_path: capdbDirectory }).into('configurations');

			console.log('Default folder structure created at', capdbDirectory);
		}

		// capdb config
		if (update) {
			console.log();
			console.error(
				'There is no configuration found to update in the database. Starting interactive configuration!',
			);
			console.log();
		}

		while (!sure) {
			if (!path) {
				path = await input({
					message: 'Enter capdb config folder path',
					validate: (value) => value.length !== 0,
				});
			}

			if (!access_key) {
				access_key = await input({
					message: 'Enter s3 access key',
					validate: (value) => value.length !== 0,
				});
			}

			if (!secret_key) {
				secret_key = await input({
					message: 'Enter s3 secret key',
					validate: (value) => value.length !== 0,
				});
			}

			if (!bucket_name) {
				bucket_name = await input({
					message: 'Enter s3 backet name',
					validate: (value) => value.length !== 0,
				});
			}

			if (!region) {
				region = await input({
					message: 'Enter s3 region',
					validate: (value) => value.length !== 0,
				});
			}

			console.log();
			console.table([
				{
					capdb_config_folder_path: path,
					s3_access_key: access_key,
					s3_secret_key: secret_key,
					s3_bucket_name: bucket_name,
					s3_region: region,
				},
			]);
			console.log();

			sure =
				(await input({
					message: 'Are you sure these are the correct information? (y/n)',
					validate: (value) => value === 'y' || value === 'n',
				})) === 'y';
			console.log();

			if (!sure) {
				let modify = await input({
					message:
						'What do you want to change? \n\nCapdb config folder path (p), s3 access key (a), s3 secret key (s), s3 bucket name (b), s3 region (r)?',
					validate: (value) => ['p', 'a', 's', 'b', 'r'].includes(value),
				});
				console.log();

				path = modify === 'p' ? '' : path;
				access_key = modify === 'a' ? '' : access_key;
				secret_key = modify === 's' ? '' : secret_key;
				bucket_name = modify === 'b' ? '' : bucket_name;
				region = modify === 'r' ? '' : region;
			}

			if (sure) {
				await db
					.insert({
						capdb_config_folder_path: path,
						s3_access_key: access_key,
						s3_secret_key: secret_key,
						s3_bucket_name: bucket_name,
						s3_region: region,
					})
					.into('configurations');
				console.log();
				process.exit(0);
			}
		}
	}

	// capdb config --update
	if (update) {
		const currentConfig = (await db.select('*').from('configurations'))[0];
		path = path ?? currentConfig.capdb_config_folder_path;
		access_key = access_key ?? currentConfig.s3_access_key;
		secret_key = secret_key ?? currentConfig.s3_secret_key;
		bucket_name = bucket_name ?? currentConfig.s3_bucket_name;
		region = region ?? currentConfig.s3_region;

		while (!sure) {
			if (!path) {
				path = await input({
					message: 'Enter capdb config folder path',
					validate: (value) => value.length !== 0,
				});
				console.log();
			}

			if (!access_key) {
				access_key = await input({
					message: 'Enter s3 access key',
					validate: (value) => value.length !== 0,
				});
				console.log();
			}

			if (!secret_key) {
				secret_key = await input({
					message: 'Enter s3 secret key',
					validate: (value) => value.length !== 0,
				});
				console.log();
			}

			if (!bucket_name) {
				bucket_name = await input({
					message: 'Enter s3 backet name',
					validate: (value) => value.length !== 0,
				});
				console.log();
			}

			if (!region) {
				region = await input({
					message: 'Enter s3 region',
					validate: (value) => value.length !== 0,
				});
				console.log();
			}

			console.log();
			console.table([
				{
					id: currentConfig.id,
					capdb_config_folder_path: path,
					s3_access_key: access_key,
					s3_secret_key: secret_key,
					s3_bucket_name: bucket_name,
					s3_region: region,
				},
			]);
			console.log();

			sure =
				(await input({
					message: 'Are you sure these are the correct information? (y/n)',
					validate: (value) => value === 'y' || value === 'n',
				})) === 'y';
			console.log();

			if (!sure) {
				let modify = await input({
					message:
						'What do you want to change? \n\nCapdb config folder path (p), s3 access key (a), s3 secret key (s), s3 bucket name (b), s3 region (r)?',
					validate: (value) => ['p', 'a', 's', 'b', 'r'].includes(value),
				});
				console.log();

				path = modify === 'p' ? '' : path;
				access_key = modify === 'a' ? '' : access_key;
				secret_key = modify === 's' ? '' : secret_key;
				bucket_name = modify === 'b' ? '' : bucket_name;
				region = modify === 'r' ? '' : region;
			}

			if (sure) {
				await db
					.update({
						capdb_config_folder_path: path,
						s3_access_key: access_key,
						s3_secret_key: secret_key,
						s3_bucket_name: bucket_name,
						s3_region: region,
					})
					.into('configurations')
					.where({ id: currentConfig.id });
				console.log();
				process.exit(0);
			}
		}
	}

	console.log();
	console.table(configurations);
	console.log();
	process.exit(0);
}
