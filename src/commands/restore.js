import fs from 'fs';
import db from '../database/db.js';
import select from '@inquirer/select';

import { exec } from 'child_process';
import { input } from '@inquirer/prompts';

async function restoreMongoDB(container, filePathToRestore) {
	// prettier-ignore
	const restoreCommand = `docker exec -i ${container.container_name} mongorestore --username=${container.database_username} --password=${container.database_password} --authenticationDatabase=admin --nsInclude=${container.database_name}.* --drop --archive < ${filePathToRestore}`;
	return new Promise((resolve, reject) => {
		exec(restoreCommand, (error, stdout) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout);
		});
	});
}

function wipePostgres(container) {
	// prettier-ignore
	const wipeCommand = `docker exec -i ${container.container_name} psql -U ${container.database_username} -d ${container.database_name} -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'`;
	return new Promise((resolve, reject) => {
		exec(wipeCommand, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}

export async function restore(cmd) {
	const containers = await db.select('*').from('containers');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		return process.exit(1);
	}

	let { index } = cmd;

	if (!index) {
		console.table(containers);
		console.log();
	}

	if (!index) {
		index = await input({
			message: 'Specify the index of the container to restore',
			validate: function (value) {
				if (value.length !== 0 && isNaN(value)) return 'Index must be a number';
				if (containers[parseInt(value)] === undefined)
					return 'No container found with the given index.';
				return true;
			},
		});
	}

	const container = containers[index];

	if (!container.last_backed_up_at || !container.status || !container.last_backed_up_file) {
		console.log();
		// prettier-ignore
		console.error('The scheduler has not run for backing up this container or it cannot be restored.');
		console.log();
		return process.exit(1);
	}

	if (container.last_backed_up_file && !fs.existsSync(container.last_backed_up_file)) {
		console.log();
		console.log('Backup file does not exist for this container.');
		console.log();
		return process.exit(1);
	}

	const validBackupedFiles = {
		message: 'Select a backup file to restore',
		choices: [],
	};

	const backupedFiles = await db.select('*').from('backups').where('container_id', container.id);

	let filePathToRestore = container.last_backed_up_file;
	let restoreMessage = `Starting restore with last backup file ${filePathToRestore}...`;

	// prettier-ignore
	const lastBackupFileOrFromHistory = (await input({ message: 'Would you like to restore the most recent file (y) or choose from history? (n)', validate: (value) => value === 'y' || value === 'n', })) === 'y';

	if (lastBackupFileOrFromHistory === false) {
		if (backupedFiles.length === 0) {
			console.log();
			console.log('No backup files found for this container.');
			console.log();
			return process.exit(1);
		}

		backupedFiles.forEach((backuup) => {
			if (backuup.file_path && fs.existsSync(backuup.file_path)) {
				validBackupedFiles.choices.push({
					name: backuup.file_name,
					value: backuup.file_path,
				});
			}
		});

		const answer = await select(validBackupedFiles);

		filePathToRestore = answer;
		restoreMessage = `Starting restore with ${answer} from history...`;
	}

	if (container.database_type === 'postgres') {
		try {
			await wipePostgres(container);
			const command = `docker exec -i ${container.container_name} psql -U ${container.database_username} -d ${container.database_name} < ${filePathToRestore}`;
			exec(command, (error, stdout) => {
				if (error) {
					console.error(`Something went wrong while restoring ${container.container_name}`, error);
					return;
				}
				if (stdout) {
					console.log(restoreMessage);
					console.log(stdout);
					console.log('Restoring done.....!');
					console.log();
					return process.exit(0);
				}
			});
		} catch (error) {
			console.log();
			console.error('Failed to wipe database', error);
			console.log();
			return process.exit(1);
		}
	}

	if (container.database_type === 'mongodb') {
		try {
			const stdout = await restoreMongoDB(container, filePathToRestore);
			console.log(`Starting restore with ${filePathToRestore}...`);
			if (stdout) {
				console.log(stdout);
			}
			console.log();
			console.log('Restoring done.');
			console.log();
			return process.exit(0);
		} catch (error) {
			console.log();
			console.error('Something went wrong while restoring MongoDB', error);
			console.log();
			return process.exit(1);
		}
	}
}
