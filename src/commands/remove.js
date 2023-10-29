import db from '../database/db.js';
import { input } from '@inquirer/prompts';

export async function remove(cmd) {
	let { id, all } = cmd;

	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations detected. Please run `capdb config` first!');
		return process.exit(1);
	}

	const containers = await db.select('*').from('containers');
	console.log();

	if (containers.length === 0) {
		console.log('No containers found in the database.');
		console.log();
		return process.exit(1);
	}

	console.table(containers);
	console.log();

	let sure = false;

	if (all) {
		const containers = await db.select('*').from('containers');

		if (containers.length === 0) {
			console.log();
			console.warn('No containers found in the database.');
			console.log();
			return process.exit(1);
		}

		console.log();
		console.table(containers);
		console.log();

		// prettier-ignore
		sure = (await input({ message: 'Are you sure these above the correct information? (y/n)', validate: (value) => value === 'y' || value === 'n', })) === 'y' ? true : false;

		if (!sure) {
			console.log();
			console.info('Ok, exited remove operation!');
			console.log();
			return process.exit(0);
		}

		await db.del('*').from('containers');

		console.log();
		console.info('Everything has been removed!');
		console.log();
		return process.exit(0);
	}

	if (!id) {
		// prettier-ignore
		id = await input({ message: 'Enter id', validate: (value) => value.length !== 0 });
	}

	const container = await db.select('*').from('containers').where({ id });

	if (container.length === 0) {
		console.log();
		console.error(`No container found with id of ${id} in the database.`);
		console.log();
		return process.exit(1);
	}

	await db('containers').where({ id }).delete();

	console.log();
	console.log(`Container of id ${id} has been removed.`);
	console.log();
	return process.exit(0);
}
