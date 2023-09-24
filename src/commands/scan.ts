import { logger, shell, Container } from '../utils';

export async function scan() {
	console.log('\n');
	await shell(`docker ps`);
	console.log('\n');
}
