import { input } from '@inquirer/prompts';
import db from '../database/db.js';
import { validDatabaseTypes } from '../utils/constants.js';

export async function add(cmd) {
	let { container, type, name, username, password, frequency } = cmd;

	const config = await db.select('*').from('configurations');

	if (config.length === 0) {
		console.log();
		console.error('No configurations detected. Please run `capdb config` first!');
		console.log();
		process.exit(0);
	}

	let sure = false;

	if (frequency && isNaN(frequency) && frequency.length) {
		console.log();
		console.log('Frequency must be a number');
		console.log();
		process.exit(0);
	}

	while (!sure) {
		if (!container) {
			console.log();
			container = await input({
				message: 'Enter container name',
				validate: (value) => value.length !== 0,
			});
		}

		if (!type) {
			console.log();
			type = await input({
				message: 'Enter database type',
				validate: function (value) {
					return validDatabaseTypes.includes(value)
						? true
						: `Invalid database type. Please enter one of: ${validDatabaseTypes.join(', ')}.`;
				},
			});
		}

		if (!name) {
			console.log();
			name = await input({
				message: 'Enter database name',
				validate: (value) => value.length !== 0,
			});
		}

		if (!username) {
			console.log();
			username = await input({
				message: 'Enter database username',
				validate: (value) => value.length !== 0,
			});
		}

		if (!password) {
			console.log();
			password = await input({
				message: 'Enter database password',
				validate: (value) => value.length !== 0,
			});
		}

		if (!frequency) {
			console.log();
			frequency = await input({
				message: 'Enter backup frequency in minutes',
				validate: function (value) {
					if (value.length === 0) return true;
					const parsedValue = parseInt(value);
					const isNumber = !isNaN(parsedValue) && parsedValue > 0;
					return value.length !== 0 && isNumber
						? true
						: 'The frequency must be in minutes. For example, 60 for every hour.';
				},
			});
		}

		console.log();
		console.table([
			{ container, type, name, username, password, frequency: frequency === '' ? 60 : frequency },
		]);
		console.log();

		sure =
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			console.log();
			const modify = await input({
				message:
					'What do you want to change? \nContainer (c), database type (t), database name (n), database username (u), database password (p), backup frequency (f) ?',
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
		process.exit(0);
	}
}
