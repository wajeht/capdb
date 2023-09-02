import { promisify } from 'util';
import { exec } from 'child_process';

import fs from 'fs';
import path from 'path';

import logger from '../utils/logger';
import { Container } from '../utils/containers';

const shell = promisify(exec);

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

		logger.info(`Dumped database ${container.database} from container ${container.name}`);

		const copyCommand = `docker cp ${container.name}:/tmp/${dumpFileName} ${backupFolder}/${dumpFileName}`;
		await shell(copyCommand);

		logger.info(`Copied dump file to ${backupFolder}/${dumpFileName}`);

		const dumpContent = fs.readFileSync(`${backupFolder}/${dumpFileName}`, 'utf-8');
		const dumpWithTimestamp = `-- Dump created at: ${new Date().toLocaleString()}\n${dumpContent}`;

		fs.writeFileSync(`${backupFolder}/${dumpFileName}`, dumpWithTimestamp, 'utf-8');

		logger.info(`Dump file ${dumpFileName} processed for container ${container.name}`);

		return container.name;
	} catch (error) {
		logger.error(`Error for ${container.name}:`, error);
		throw error;
	}
}


export default async function backupScript(containers: Container[]) {
	const results: string[] = [];

	for (const container of containers) {
		try {
			const result = await performPgDump(container);
			results.push(result);
		} catch (error) {
			logger.error(`Error processing ${container.name}:`, error);
		}
	}

	logger.info('All done:', results);
}