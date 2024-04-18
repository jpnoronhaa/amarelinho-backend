import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('professionals_categories', function(table) {
    table.increments('id').primary();
    table.integer('professional_id').unsigned().notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.foreign('professional_id').references('id').inTable('professional');
    table.foreign('category_id').references('id').inTable('category');
    table.timestamps(true, true);
 });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('professionals_categories');
}

