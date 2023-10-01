import knex from 'knex';
import knexConfig from './knexfile.js';
import { env } from '../utils/constants.js';

const db = knex(knexConfig[env]);

export default db;
