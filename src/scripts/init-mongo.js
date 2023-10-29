/* eslint-disable no-undef */

db = db.getSiblingDB('database');

db.createUser({
	user: 'username',
	pwd: 'password',
	roles: [
		{
			role: 'readWrite',
			db: 'database',
		},
	],
});

db.capdb.insert({ name: 'capdb' });
