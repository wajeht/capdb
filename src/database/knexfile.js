import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knexConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: path.resolve(__dirname, 'db.sqlite'),
	},
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

if (process.env.NODE_ENV === 'testing') {
	knexConfig.connection = {
		filename: ':memory:',
	};
}

export default knexConfig;
