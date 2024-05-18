import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('user_images', function(table) {
        table.string('image_path', 2048).alter();
    });
};
  

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('user_images', function(table) {
        table.string('image_path', 255).alter();
    });
};
  