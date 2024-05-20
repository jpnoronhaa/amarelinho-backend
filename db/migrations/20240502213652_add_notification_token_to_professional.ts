import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('professional', (table) => {
        table.string('notificationToken').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('professional', (table) => {
        table.dropColumn('notificationToken');
    });
}

