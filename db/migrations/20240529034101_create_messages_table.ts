import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('messages', (table) => {
        table.uuid('id').primary();
        table.integer('senderId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('receiverId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.text('content').notNullable();
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.boolean('read').defaultTo(false);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('messages');
}
