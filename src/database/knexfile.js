const knexConfig = {
	development: {
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: './db.sqlite',
		},
		migrations: { directory: './migrations' },
		seeds: { directory: './seeds' },
		pool: {
			afterCreate: (conn, done) => {
				conn.run('PRAGMA foreign_keys = ON', done);
			},
		},
	},
	production: {
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: './db.sqlite',
		},
		migrations: { directory: './migrations' },
		seeds: { directory: './seeds' },
		pool: {
			afterCreate: (conn, done) => {
				conn.run('PRAGMA foreign_keys = ON', done);
			},
		},
	},
};

export default knexConfig;
