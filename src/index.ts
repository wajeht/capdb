import { promisify } from 'util';
import { exec } from 'child_process';

import Queue from 'queue';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import logger from './logger';

const shell = promisify(exec);

interface Container {
	name: string;
	username: string;
	database: string;
}

const containers: Container[] = [
	{ name: 'postgres', username: 'username', database: 'database' },
	{ name: 'postgres', username: 'username', database: 'database' },
	{ name: 'postgres', username: 'username', database: 'database' },
];

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
		console.error(`Error for ${container.name}:`, error);
		throw error;
	}
}

async function backupScript() {
	const q = new Queue({ results: [] });

	for (const container of containers) {
		q.push(async () => {
			try {
				const result = await performPgDump(container);
				return result;
			} catch (error) {
				console.error(`Error processing ${container.name}:`, error);
				throw error;
			}
		});
	}

	q.addEventListener('success', (e: any) => {
		logger.info('Job finished processing:', e.detail.result);
	});

	q.addEventListener('timeout', (e: any) => {
		logger.info('Job timed out:', e.detail.job.toString().replace(/\n/g, ''));
		e.detail.next();
	});

	try {
		await q.start();
		logger.info('All done:', q.results);
	} catch (error) {
		console.error('Error during processing:', error);
	}
}

logger.info('Script started. Scheduling cron job...');

// run every 3 hours
cron.schedule('0 */3 * * *', async () => {
	logger.info('Cron job started at:', new Date().toLocaleString());

	logger.info('Running backup script...');

	await backupScript();

	logger.info('Backup script completed.');
});
