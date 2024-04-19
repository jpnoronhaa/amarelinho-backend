import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('reviews', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('professional_id').unsigned().notNullable();
        table.integer('rating').notNullable();
        table.text('comment').notNullable();
        table.json('images').nullable();
        table.timestamps(true, true);
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('professional_id').references('id').inTable('professional').onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('reviews');
}

