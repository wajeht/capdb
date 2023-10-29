import knex from 'knex';
import knexConfig from './knexfile.js';

let config = knexConfig.production;

if (process.env.NODE_ENV === 'testing') {
	config = knexConfig.testing;
}

export default knex(config);
