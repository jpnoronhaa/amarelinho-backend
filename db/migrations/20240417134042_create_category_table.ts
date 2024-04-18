import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('category', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.timestamps(true, true);
 });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('category');
}

