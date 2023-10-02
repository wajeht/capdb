import { input } from '@inquirer/prompts';
import db from '../database/db.js';

export async function remove(cmd) {
	let { id, all } = cmd;

	let sure = false;

	if (all) {
		const containers = await db.select('*').from('containers');

		if (containers.length === 0) {
			console.log();
			console.warn('No containers found in the database.');
			console.log();
			process.exit(0);
		}

		console.table(containers);

		sure =
			(await input({
				message: 'Are you sure these above the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y'
				? true
				: false;

		if (!sure) {
			console.log();
			console.info('Ok, exited remove operation!');
			console.log();
			process.exit(0);
		}

		await db.del('*').from('containers');

		console.log();
		console.info('Everything has been removed!');
		console.log();
		process.exit(0);
	}

	if (!id) {
		id = await input({
			message: 'Enter id',
			validate: (value) => value.length !== 0,
		});
	}

	await db('containers').where({ id }).delete();
	process.exit(0);
}
