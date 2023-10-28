import { input } from '@inquirer/prompts';
import db from '../database/db.js';
import { validDatabaseTypes } from '../utils/constants.js';

export async function update(cmd) {
	let { id } = cmd;
	const config = await db.select('*').from('configurations');

	if (config.length === 0) {
		console.log('No configurations detected. Please run `capdb config` first!');
		process.exit(0);
	}

	const containers = await db.select('*').from('containers');

	if (containers.length === 0) {
		console.log();
		console.log('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	console.table(containers);
	console.log();

	let sure = false;
	while (!sure) {
		if (!id) {
			id = await input({
				message: 'Enter the ID of the credentials to update',
				validate: (value) => value.length !== 0,
			});
			console.log();
		}

		const credentials = await db.select('*').from('containers').where('id', id);

		if (credentials.length === 0) {
			console.log('No credentials found with that ID');
			console.log();
			process.exit(0);
		}

		const {
			container_name,
			database_type,
			database_name,
			database_username,
			database_password,
			back_up_frequency,
		} = credentials[0];

		console.log();
		console.log('Which field would you like to update?');
		console.log();

		const modify = await input({
			// prettier-ignore
			message: 'Container (c), database type (t), database name (n), database username (u), database password (p), backup frequency (f) ?',
			validate: (value) => ['c', 't', 'n', 'u', 'p', 'f'].includes(value),
		});
		console.log();

		let newValue;
		let columnName;

		if (modify === 'c') {
			columnName = 'container_name';
			newValue = await input({
				message: `Enter container name (${container_name})`,
				validate: (value) => value.length !== 0,
				default: container_name,
			});
		} else if (modify === 't') {
			columnName = 'database_type';
			newValue = await input({
				message: `Enter database type (${database_type})`,
				validate: (value) => validDatabaseTypes.includes(value),
				default: database_type,
			});
		} else if (modify === 'n') {
			columnName = 'database_name';
			newValue = await input({
				message: `Enter database name (${database_name})`,
				validate: (value) => value.length !== 0,
				default: database_name,
			});
		} else if (modify === 'u') {
			columnName = 'database_username';
			newValue = await input({
				message: `Enter database username (${database_username})`,
				validate: (value) => value.length !== 0,
				default: database_username,
			});
		} else if (modify === 'p') {
			columnName = 'database_password';
			newValue = await input({
				message: `Enter database password (${database_password})`,
				validate: (value) => value.length !== 0,
				default: database_password,
			});
		} else if (modify === 'f') {
			columnName = 'back_up_frequency';
			newValue = await input({
				message: `Enter backup frequency in minutes (${back_up_frequency})`,
				validate: (value) => value.length !== 0,
				default: back_up_frequency,
			});
		}

		console.log();
		console.log(`New ${columnName}: ${newValue}`);
		console.log();

		sure =
			(await input({
				message: 'Is this correct? (y/n)',
				validate: (value) => ['y', 'n'].includes(value),
			})) === 'y';
		console.log();

		if (sure) {
			const updateData = {};
			updateData[columnName] = newValue;

			await db('containers').where('id', id).update(updateData);
			console.log();
			console.log('Credentials updated successfully!');
			console.log();
			process.exit(0);
		}
	}
}
