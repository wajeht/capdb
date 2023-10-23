export function up(knex) {
	return knex.schema.createTable('backups', (table) => {
		table.increments('id').primary().notNullable();
		table.string('container_id').notNullable();
		table.integer('file_name').notNullable();
		table.string('file_path').notNullable();
	});
}

export function down(knex) {
	return knex.schema.dropTable('backups');
}
