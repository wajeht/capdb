import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	migrations: {
		tableName: 'knex_migrations',
		directory: path.resolve(__dirname, './migrations'),
	},
	seeds: { directory: path.resolve(__dirname, './seeds') },
	pool: {
		afterCreate: (conn, done) => {
			conn.run('PRAGMA foreign_keys = ON', done);
		},
	},
};

const knexConfig = {
	testing: {
		...baseConfig,
		connection: {
			filename: ':memory:',
		},
	},
	production: {
		...baseConfig,
		connection: {
			filename: path.resolve(__dirname, 'db.sqlite'),
		},
	},
};

export default knexConfig;
