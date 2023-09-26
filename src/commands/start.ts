import { Container, Database as db, logger, shell } from '../utils';
import cron from 'node-cron';

async function backupDatabase(container: Container): Promise<void> {
	switch (container.database_type) {
		case 'postgres':
			process.env.PGPASSWORD = container.database_password;
			await shell(
				`docker exec -i ${container.container_name} pg_dump -U ${container.database_username} -d ${container.database_name} > dump.sql`,
			);
			delete process.env.PGPASSWORD;
			break;
		case 'mysql':
			await shell(
				`docker exec -i ${container.container_name} mysqldump -u${container.database_username} -p${container.database_password} ${container.database_name} > dump.sql`,
			);
			break;
		case 'mongodb':
			await shell(
				`docker exec -i ${container.container_name} mongodump --username ${container.database_username} --password ${container.database_password} --db ${container.database_name} --out /backup`,
			);
			break;
		case 'redis':
			await shell(`docker exec -i ${container.container_name} redis-cli save`);
			break;
		default:
			console.log(`Unsupported database type: ${container.database_type}`);
			break;
	}
}

(async function start() {
	const containers = db.getAll();
	containers.map((container) => {
		const task = cron.schedule(
			`*/${container.back_up_frequency} * * * *`,
			async () => {
				// logger(`backup started for ${container.container_name}`);
				await backupDatabase(container);
				// logger(`done backup for ${container.container_name}`);
			},
			{
				scheduled: false,
			},
		);
		task.start();
		// logger(`backup scheduled for ${container.container_name}`);
	});
	process.exit(0);
})();
