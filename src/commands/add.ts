import { input } from '@inquirer/prompts';
import { Database as db, logger } from '../utils';
import { validDatabaseTypes, DatabaseType } from '../utils';

export async function add(cmd: any) {
	let { container, username, database, type } = cmd;

	let modify = undefined;

	let sure = false;

	if (!container || !username || !database || !type) {
		while (sure === false) {
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

			if (!database) {
				database = await input({
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

			console.table({ container, username, database, type });

			// sure = await confirm({ message: 'are you sure?' })

			sure =
				(await input({
					message: 'Are you sure these are the correct information? (y/n)',
					validate: (value) => value === 'y' || value === 'n',
				})) === 'y'
					? true
					: false;

			if (!sure) {
				modify = await input({
					message:
						'what do you want to chagne? database (u), databse type (t), container (c), username (u) ?',
					validate: (value) => ['c', 'u', 'd', 't'].includes(value) === true,
				});

				container = modify === 'c' ? '' : container;
				username = modify === 'u' ? '' : username;
				database = modify === 'd' ? '' : database;
				type = modify === 't' ? '' : type;
			}
		}
	}

	db.add({
		container_name: container,
		database_tye: type,
		database_name: database,
		database_username: username,
	});

	logger('The following credentials have been added.');

	console.table({ container, username, database, type });
}
