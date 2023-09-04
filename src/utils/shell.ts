import { spawn, ChildProcess } from 'child_process';

export async function shell(command: string): Promise<ChildProcess | null> {
	const childProcess = spawn(command, {
		shell: true,
		stdio: 'inherit',
		env: process.env,
	});

	if (childProcess.stdout) {
		childProcess.stdout.on('data', (data) => {
			console.log(data.toString());
		});
	}

	if (childProcess.stderr) {
		childProcess.stderr.on('data', (data) => {
			console.error(data.toString());
		});
	}

	return childProcess;
}
