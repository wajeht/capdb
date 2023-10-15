import db from '../database/db.js';
import fs from 'fs';

function isValidJSONFormat(data) {
	if (!data || !Array.isArray(data.containers) || !Array.isArray(data.config)) return false;

	for (const container of data.containers) {
		if (
			!container.id ||
			!container.container_name ||
			!container.database_type ||
			!container.database_name ||
			!container.database_username ||
			!container.database_password ||
			container.status === undefined ||
			container.back_up_to_s3 === undefined ||
			container.back_up_frequency === undefined
		)
			return false;
	}
	for (const config of data.config) {
		if (!config.id || !config.capdb_config_folder_path) return false;
	}
	return true;
}

export async function importt(cmd) {
	const { file } = cmd;

	if (!fs.existsSync(file)) {
		console.log();
		console.error('File does not exist.');
		console.log();
		process.exit(0);
	}
	if (!file.endsWith('.json')) {
		console.log();
		console.error('File is not a json file.');
		console.log();
		process.exit(0);
	}

	const fileContent = fs.readFileSync(file, 'utf-8');
	const jsonData = JSON.parse(fileContent);

	if (!isValidJSONFormat(jsonData)) {
		console.log();
		console.error('Invalid JSON file format.');
		console.log();
		process.exit(0);
	}

	if (jsonData.containers.length === 0 || jsonData.config.length === 0) {
		console.log();
		console.error('No containers or configurations to import.');
		console.log();
		process.exit(0);
	}

	const containerInsertPromise = jsonData.containers.map((container) => {
		// @eslint-ignore
		const { id, ...rest } = container;
		return db('containers').insert({ ...rest });
	});

	const configInsertPromise = jsonData.config.map((config) => {
		// @eslint-ignore
		const { id, ...rest } = config;
		return db('configurations').insert({ ...rest });
	});

	await Promise.allSettled([...containerInsertPromise, ...configInsertPromise]);

	console.log();
	console.log('Imported successfully.');
	console.log();
	process.exit(0);
}
