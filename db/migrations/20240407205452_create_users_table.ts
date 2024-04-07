import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.boolean('isActive').notNullable().defaultTo(true);
        table.timestamps(true, true); // created_at e updated_at com timestamps
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}

