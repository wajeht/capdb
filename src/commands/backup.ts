import fs from 'fs';
import path from 'path';

import { logger, shell, Container } from '../utils';

async function performPgDump(container: Container): Promise<string> {
	try {
		const timestamp = new Date().toISOString().replace(/[-T:.]/g, '');
		const dumpFileName = `dump_${container.container_name}_${timestamp}.sql`;
		const backupFolder = path.join(__dirname, '..', 'backup');

		if (!fs.existsSync(backupFolder)) {
			fs.mkdirSync(backupFolder);
		}

		const dumpCommand = `docker exec ${container.container_name} pg_dump -U ${container.database_username} -d ${container.database_name} -f /tmp/${dumpFileName}`;
		await shell(dumpCommand);

		logger(`Dumped database ${container.database_name} from container ${container.container_name}`);

		const copyCommand = `docker cp ${container.container_name}:/tmp/${dumpFileName} ${backupFolder}/${dumpFileName}`;
		await shell(copyCommand);

		logger(`Copied dump file to ${backupFolder}/${dumpFileName}`);

		const dumpContent = fs.readFileSync(`${backupFolder}/${dumpFileName}`, 'utf-8');
		const dumpWithTimestamp = `-- Dump created at: ${new Date().toLocaleString()}\n${dumpContent}`;

		fs.writeFileSync(`${backupFolder}/${dumpFileName}`, dumpWithTimestamp, 'utf-8');

		logger(`Dump file ${dumpFileName} processed for container ${container.container_name}`);

		return container.container_name;
	} catch (error) {
		logger(`Error for ${container.container_name}:`, error);
		throw error;
	}
}

export async function backup(containers: Container[]) {
	const results: string[] = [];

	for (const container of containers) {
		try {
			const result = await performPgDump(container);
			results.push(result);
		} catch (error) {
			logger(`Error processing ${container.container_name}:`, error);
		}
	}

	logger('All done:', results);
}
