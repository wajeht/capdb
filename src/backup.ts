import logger from './logger';
import { Container, containers } from './containers';
import { performPgDump } from './pg-dump';

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
