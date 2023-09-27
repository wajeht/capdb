import { spawn } from 'child_process';

export async function shell(command) {
	const childProcess = spawn(command, { shell: true, stdio: 'inherit', env: process.env });
	return new Promise((resolve, reject) => {
		childProcess.on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command failed with exit code ${code}`));
			}
		});
	});
}
