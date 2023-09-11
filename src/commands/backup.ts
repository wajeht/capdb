import fs from 'fs';
import path from 'path';

import { Container, logger, shell } from '../utils';

async function performPgDump(container: Container): Promise<string> {
	try {
		const timestamp = new Date().toISOString().replace(/[-T:.]/g, '');
		const dumpFileName = `dump_${container.name}_${timestamp}.sql`;
		const backupFolder = path.join(__dirname, '..', 'backup');

		if (!fs.existsSync(backupFolder)) {
			fs.mkdirSync(backupFolder);
		}

		const dumpCommand = `docker exec ${container.name} pg_dump -U ${container.username} -d ${container.database} -f /tmp/${dumpFileName}`;
		await shell(dumpCommand);

		logger(`Dumped database ${container.database} from container ${container.name}`);

		const copyCommand = `docker cp ${container.name}:/tmp/${dumpFileName} ${backupFolder}/${dumpFileName}`;
		await shell(copyCommand);

		logger(`Copied dump file to ${backupFolder}/${dumpFileName}`);

		const dumpContent = fs.readFileSync(`${backupFolder}/${dumpFileName}`, 'utf-8');
		const dumpWithTimestamp = `-- Dump created at: ${new Date().toLocaleString()}\n${dumpContent}`;

		fs.writeFileSync(`${backupFolder}/${dumpFileName}`, dumpWithTimestamp, 'utf-8');

		logger(`Dump file ${dumpFileName} processed for container ${container.name}`);

		return container.name;
	} catch (error) {
		logger(`Error for ${container.name}:`, error);
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
			logger(`Error processing ${container.name}:`, error);
		}
	}

	logger('All done:', results);
}
