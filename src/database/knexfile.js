const knexConfig = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: './db.sqlite',
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: './migrations',
	},
	seeds: { directory: './seeds' },
	pool: {
		afterCreate: (conn, done) => {
			conn.run('PRAGMA foreign_keys = ON', done);
		},
	},
};

export default knexConfig;
