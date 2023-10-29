import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		watch: true,
		setupFiles: '/src/utils/test-setup.js',
	},
});
