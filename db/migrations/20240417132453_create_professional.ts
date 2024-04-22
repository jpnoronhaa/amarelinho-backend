import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('professional', (table) => {
    table.increments('id').primary();
    table.integer('phoneNumber').unique().notNullable();
    table.text('description').notNullable();
    table.integer('userId').unsigned().notNullable();
    table.timestamps(true, true);
    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('professional');
}

