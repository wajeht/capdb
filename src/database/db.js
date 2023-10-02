import knex from 'knex';
import knexConfig from './knexfile.js';

process.chdir('src/database');

// knex(knexConfig)
// 	.raw('SELECT 1 + 1')
// 	.then(() => {
// 		console.debug('Database connection started!');
// 	})
// 	.catch(() => {
// 		console.error('Database connection failed!');
// 		process.exit(1);
// 	});

export default knex(knexConfig);
