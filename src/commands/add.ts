import { input } from '@inquirer/prompts';
import { Database as db, logger } from '../utils';

export async function add(cmd: any) {
	let { container, username, database } = cmd;

	let modify = undefined;

	let sure = false;

	if (!container || !username || !database) {
		while (sure === false) {
			if (!container) {
				container = await input({
					message: 'Enter container name',
					validate: (value) => value.length !== 0,
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

			console.table({ container, username, database });

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
					message: 'what do you want to chagne? database (u), container (c), username (u) ?',
					validate: (value) => ['c', 'u', 'd'].includes(value) === true,
				});

				container = modify === 'c' ? '' : container;
				username = modify === 'u' ? '' : username;
				database = modify === 'd' ? '' : database;
			}
		}
	}

	db.add({
		container_name: container,
		database_name: database,
		database_username: username,
	});

	logger('The following credentials have been added.');

	console.table({ container, username, database });
}
