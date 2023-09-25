import { logger, shell, Container } from '../utils';

export async function scan() {
	console.log('');
	await shell(`docker ps`);
	console.log('');
}
