export function up(knex) {
	return knex.schema.createTable('containers', (table) => {
		table.increments('id').primary().notNullable();
		table.string('container_name').notNullable();
		table.integer('database_type').notNullable();
		table.integer('database_name').notNullable();
		table.string('database_username').notNullable();
		table.string('database_password').notNullable();
		table.boolean('status').defaultTo(null);
		table.integer('back_up_frequency').defaultTo(null);
		table.datetime('last_backed_up_at').defaultTo(null);
		table.string('last_backed_up_file').defaultTo(null);
		table.timestamps();
	});
}

export function down(knex) {
	return knex.schema.dropTable('containers');
}
