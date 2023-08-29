export interface Container {
	name: string;
	username: string;
	database: string;
}

export const containers: Container[] = [
	{ name: 'postgres', username: 'username', database: 'database' },
	{ name: 'postgres', username: 'username', database: 'database' },
	{ name: 'postgres', username: 'username', database: 'database' },
];
