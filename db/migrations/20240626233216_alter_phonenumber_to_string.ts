import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('professional', (table) => {
    table.dropUnique(['phoneNumber']);
    table.string('phoneNumber').notNullable().alter();
    table.unique(['phoneNumber']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('professional', (table) => {
    table.dropUnique(['phoneNumber']);
    table.integer('phoneNumber').notNullable().alter();
    table.unique(['phoneNumber']);
  });
}
