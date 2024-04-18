import { knex } from '../database';

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

class Category {
  async create(category: Omit<ICategory, 'id' | 'created_at' | 'updated_at'>): Promise<ICategory> {
    const now = new Date();
    const newCategory = {
      ...category,
      created_at: now,
      updated_at: now,
    }
    const [createdCategory] = await knex<ICategory>('category').insert(newCategory).returning('*');
    if (!createdCategory) {
      throw new Error("Erro ao criar categoria");
    }
    return createdCategory;
  }

  async findAll(): Promise<ICategory[]> {
    return await knex('category').select('*');
  }

  async findOne(id: number): Promise<ICategory | undefined> {
    return await knex('category').where({ id }).first();
  }

  async update(id: number, category: Partial<ICategory>): Promise<boolean> {
      const updatedRows = await knex('category').where({ id }).update(category);
      return updatedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
      const deletedRows = await knex('category').where({ id }).del();
      return deletedRows > 0;
  }
}

export default new Category();
