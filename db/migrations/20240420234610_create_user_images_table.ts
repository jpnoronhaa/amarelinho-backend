import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_images', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
        table.string('image_path').notNullable();
        table.timestamps(true, true); // created_at e updated_at com timestamps

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_images');
}
