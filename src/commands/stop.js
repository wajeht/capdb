import pm2 from 'pm2';
import db from '../database/db.js';

export async function stop() {
	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations found in database. Please run `capdb config` first.');
		console.log();
		return process.exit(1);
	}

	const containers = await db.select('*').from('containers');

	if (containers.length === 0) {
		console.log();
		console.error('No containers found in the database.');
		console.log();
		return process.exit(0);
	}

	pm2.connect((err) => {
		if (err) {
			console.log();
			console.log('Could not connect to PM2:', err);
			console.log();
			return process.exit(1);
		}

		pm2.list((listErr, list) => {
			if (listErr) {
				console.log();
				console.log('Error listing processes:', listErr);
				console.log();
				pm2.disconnect();
				return process.exit(1);
			}

			const capdbProcess = list.find((process) => process.name === 'capdb');

			if (!capdbProcess) {
				console.log();
				console.log('The "capdb" process does not exist.');
				console.log();
				pm2.disconnect();
				return process.exit(1);
			}

			pm2.delete('capdb', (deleteErr) => {
				if (deleteErr) {
					console.log();
					console.log('Error stopping the process:', deleteErr);
					console.log();
					pm2.disconnect();
					return process.exit(1);
				}

				pm2.dump(() => {
					console.log();
					console.log('Process stopped and changes saved.');
					pm2.disconnect();
					console.log();
					return process.exit(0);
				});
			});
		});
	});
}
