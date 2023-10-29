import db from '../database/db.js';
import { input } from '@inquirer/prompts';
import { validDatabaseTypes } from '../utils/constants.js';

export async function add(cmd) {
	let { container, type, name, username, password, frequency } = cmd;

	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations detected. Please run `capdb config` first!');
		console.log();
		return process.exit(1);
	}

	let sure = false;

	if (frequency && isNaN(frequency) && frequency.length) {
		console.log();
		console.error('Frequency must be a number');
		console.log();
		return process.exit(1);
	}

	while (!sure) {
		if (!container) {
			console.log();
			// prettier-ignore
			container = await input({ message: 'Enter container name', validate: (value) => value.length !== 0 });
		}

		if (!type) {
			console.log();
			type = await input({
				message: 'Enter database type',
				validate: function (value) {
					// prettier-ignore
					return validDatabaseTypes.includes(value) ? true : `Invalid database type. Please enter one of: ${validDatabaseTypes.join(', ')}.`;
				},
			});
		}

		if (!name) {
			console.log();
			// prettier-ignore
			name = await input({ message: 'Enter database name', validate: (value) => value.length !== 0 });
		}

		if (!username) {
			console.log();
			// prettier-ignore
			username = await input({ message: 'Enter database username', validate: (value) => value.length !== 0 });
		}

		if (!password) {
			console.log();
			// prettier-ignore
			password = await input({ message: 'Enter database password', validate: (value) => value.length !== 0 });
		}

		if (!frequency) {
			console.log();
			frequency = await input({
				message: 'Enter backup frequency in minutes',
				validate: function (value) {
					if (value.length === 0) return true;
					const parsedValue = parseInt(value);
					const isNumber = !isNaN(parsedValue) && parsedValue > 0;
					// prettier-ignore
					return value.length !== 0 && isNumber ? true : 'The frequency must be in minutes. For example, 60 for every hour.';
				},
			});
		}

		console.log();
		// prettier-ignore
		console.table([ { container, type, name, username, password, frequency: frequency === '' ? 60 : frequency } ]);
		console.log();

		// prettier-ignore
		sure = (await input({ message: 'Are you sure these are the correct information? (y/n)', validate: (value) => value === 'y' || value === 'n' })) === 'y';

		if (!sure) {
			console.log();
			const modify = await input({
				// prettier-ignore
				message: 'What do you want to change? \nContainer (c), database type (t), database name (n), database username (u), database password (p), backup frequency (f) ?',
				validate: (value) => ['c', 't', 'n', 'u', 'p', 'f'].includes(value) === true,
			});

			type = modify === 't' ? '' : type;
			name = modify === 'n' ? '' : name;
			username = modify === 'u' ? '' : username;
			password = modify === 'p' ? '' : password;
			frequency = modify === 'f' ? '' : frequency;
		}
	}

	if (sure) {
		await db('containers').insert({
			container_name: container,
			database_type: type,
			database_name: name,
			database_username: username,
			database_password: password,
			back_up_frequency: frequency === '' ? 60 : frequency,
		});

		console.log('');
		console.log('Those credentials have been added.');
		console.log();
		return process.exit(0);
	}
}
