import db from '../database/db.js';
import pm2 from 'pm2';

export async function stop() {
	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.error('No configurations found in database. Please run `capdb config` first.');
		process.exit(1);
	}

	const containers = await db.select('*').from('containers');

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	pm2.connect((err) => {
		if (err) {
			console.error('Could not connect to PM2:', err);
			process.exit(1);
		}

		pm2.list((listErr, list) => {
			if (listErr) {
				console.error('Error listing processes:', listErr);
				pm2.disconnect();
				process.exit(1);
			}

			const capdbProcess = list.find((process) => process.name === 'capdb');

			if (!capdbProcess) {
				console.error('The "capdb" process does not exist.');
				pm2.disconnect();
				process.exit(1);
			}

			pm2.delete('capdb', (deleteErr) => {
				if (deleteErr) {
					console.error('Error stopping the process:', deleteErr);
					pm2.disconnect();
					process.exit(1);
				}

				pm2.dump(() => {
					console.log('Process stopped and changes saved.');
					pm2.disconnect();
					process.exit(0);
				});
			});
		});
	});
}
