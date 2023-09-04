import { shell } from '../utils/shell';

export const list = async function () {
	await shell('pm2 list');
};
