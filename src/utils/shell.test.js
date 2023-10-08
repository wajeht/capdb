import { shell } from './shell.js';
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';

describe('shell', async () => {
	it('should execute a command', async () => {
		const testCommand = 'echo "Hello World"';
		await shell(testCommand);
		const result = spawnSync(testCommand, { shell: true });
		expect(result.stdout.toString()).toBe('Hello World\n');
	});
});
