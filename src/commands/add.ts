import { input } from '@inquirer/prompts';
import { Database as db, logger } from '../utils';
import { validDatabaseTypes, DatabaseType } from '../utils';

export async function add(cmd: any) {
	let { container, type, name, username, password, frequency } = cmd;

	let sure = false;

	if (frequency && isNaN(frequency) && frequency.length) {
		console.log();
		console.log('Frequency must be a number');
		console.log();
		return;
	}

	while (!sure) {
		if (!container) {
			container = await input({
				message: 'Enter container name',
				validate: (value) => value.length !== 0,
			});
		}

		if (!type) {
			type = await input({
				message: 'Enter database type',
				validate: function (value) {
					return validDatabaseTypes.includes(value as DatabaseType)
						? true
						: `Invalid database type. Please enter one of: ${validDatabaseTypes.join(', ')}.`;
				},
			});
		}

		if (!name) {
			name = await input({
				message: 'Enter database name',
				validate: (value) => value.length !== 0,
			});
		}

		if (!username) {
			username = await input({
				message: 'Enter database username',
				validate: (value) => value.length !== 0,
			});
		}

		if (!password) {
			password = await input({
				message: 'Enter database password',
				validate: (value) => value.length !== 0,
			});
		}

		if (!frequency) {
			frequency = await input({
				message: 'Enter backup frequency in minutes',
				validate: function (value) {
					const parsedValue = parseInt(value);
					const isNumber = !isNaN(parsedValue) && parsedValue > 0;
					return value.length !== 0 && isNumber
						? true
						: 'The frequency must be in minutes. For example, 60 for every hour.';
				},
			});
		}

		console.log();
		console.table([{ container, type, name, username, password, frequency }]);
		console.log();

		sure =
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			const modify = await input({
				message:
					'What do you want to change? \nContainer (c), database type (t), database name (n), database username (u), database password (p), backup frequency (f) ?',
				validate: (value) => ['c', 't', 'n', 'u', 'p', 'f'].includes(value) === true,
			});

			// Handle modifications
			type = modify === 't' ? '' : type;
			name = modify === 'n' ? '' : name;
			username = modify === 'u' ? '' : username;
			password = modify === 'p' ? '' : password;
			frequency = modify === 'f' ? '' : frequency;
		}
	}

	if (sure) {
		db.add({
			container_name: container,
			database_type: type,
			database_name: name,
			database_username: username,
			database_password: password,
			back_up_frequency: frequency,
		});

		console.log('');

		logger('The following credentials have been added.');

		console.table([{ container, type, name, username, password, frequency }]);
	}
}
