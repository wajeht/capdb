import fs from 'fs';
import os from 'os';
import path from 'path';
import ppath from 'path';
import db from '../database/db.js';
import { input } from '@inquirer/prompts';

const capdbDirectory = path.join(os.homedir(), 'capdb');
const backupsDirectory = path.join(capdbDirectory, 'backups');
const logsDirectory = path.join(capdbDirectory, 'logs');

export async function config(cmd) {
	let {
		path,
		default: dafault,
		update,
		access_key,
		secret_key,
		bucket_name,
		region,
		removeAll,
	} = cmd;

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

			console.log();
			console.log('Default folder structure created at', capdbDirectory);
			console.log();
			return process.exit(0);
		}

		// capdb config --remove-all
		if (removeAll) {
			console.log();
			// prettier-ignore
			console.log('There is no configuration found to remove in the database. Starting interactive configuration!');
			console.log();
		}

		// capdb config
		if (update) {
			console.log();
			// prettier-ignore
			console.error('There is no configuration found to update in the database. Starting interactive configuration!');
			console.log();
		}

		while (!sure) {
			if (!path) {
				let pathIsValid = false;
				while (!pathIsValid) {
					console.log();
					path = await input({
						message: 'Enter capdb config folder path',
					});

					if (path.length === 0) {
						console.log();
						console.log('Path cannot be empty!');
					} else if (!fs.existsSync(path)) {
						console.log();
						const createDir = await input({
							message: 'Path does not exist. Do you want to create it? (y/n)',
							validate: (value) => value === 'y' || value === 'n',
						});

						if (createDir === 'y') {
							try {
								if (path.startsWith('~/')) {
									path = path.replace(/^~\//, os.homedir() + '/');
								} else if (!path.startsWith('/') && !path.startsWith('~')) {
									path = ppath.join(os.homedir(), path);
								}

								fs.mkdirSync(path, { recursive: true });

								if (fs.existsSync(path)) {
									console.log();
									console.log(path);
									console.log();
									console.log('Directory created successfully!');

									path = ppath.resolve(path);
									pathIsValid = true;
								} else {
									console.log();
									console.log('Failed to create the directory.');
								}
							} catch (err) {
								console.log();
								console.error(`Error creating directory: ${err.message}`);
							}
						}
					} else {
						console.log();
						console.log(path);
						console.log();
						console.log('Directory created successfully!');
						pathIsValid = true;
					}
				}
			}

			if (!access_key) {
				console.log();
				// prettier-ignore
				access_key = await input({ message: 'Enter s3 access key' });
			}

			if (!secret_key) {
				console.log();
				// prettier-ignore
				secret_key = await input({ message: 'Enter s3 secret key' });
			}

			if (!bucket_name) {
				console.log();
				// prettier-ignore
				bucket_name = await input({ message: 'Enter s3 backet name' });
			}

			if (!region) {
				console.log();
				// prettier-ignore
				region = await input({ message: 'Enter s3 region' });
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

			// prettier-ignore
			sure = (await input({ message: 'Are you sure these are the correct information? (y/n)', validate: (value) => value === 'y' || value === 'n', })) === 'y';
			console.log();

			if (!sure) {
				let modify = await input({
					// prettier-ignore
					message: 'What do you want to change? \n\nCapdb config folder path (p), s3 access key (a), s3 secret key (s), s3 bucket name (b), s3 region (r)?',
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
				return process.exit(0);
			}
		}
	}

	// capdb config --remove-all
	if (removeAll) {
		console.log();
		console.table(configurations);
		console.log();

		// prettier-ignore
		sure = (await input({ message: 'Are you sure you want to remove all configurations?(y/n)', validate: (value) => value === 'y' || value === 'n' })) === 'y';

		if (sure) {
			await db.del('*').from('configurations');
			console.log();
			console.log('All configuration have been removed!');
			console.log();
			return process.exit(0);
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
				// prettier-ignore
				path = await input({ message: 'Enter capdb config folder path', validate: (value) => value.length !== 0 });
				console.log();
			}

			if (!access_key) {
				// prettier-ignore
				access_key = await input({ message: 'Enter s3 access key' });
				console.log();
			}

			if (!secret_key) {
				// prettier-ignore
				secret_key = await input({ message: 'Enter s3 secret key' });
				console.log();
			}

			if (!bucket_name) {
				// prettier-ignore
				bucket_name = await input({ message: 'Enter s3 backet name' });
				console.log();
			}

			if (!region) {
				// prettier-ignore
				region = await input({ message: 'Enter s3 region' });
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

			// prettier-ignore
			sure = (await input({ message: 'Are you sure these are the correct information? (y/n)', validate: (value) => value === 'y' || value === 'n', })) === 'y';
			console.log();

			if (!sure) {
				let modify = await input({
					// prettier-ignore
					message: 'What do you want to change? \n\nCapdb config folder path (p), s3 access key (a), s3 secret key (s), s3 bucket name (b), s3 region (r)?',
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
				return process.exit(0);
			}
		}
	}

	console.log();
	console.table(configurations);
	console.log();
	return process.exit(0);
}
