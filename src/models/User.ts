import { knex } from "../database";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

interface IUserQuery {
  id?: number;
  email?: string;
}

class User {
  async create(user: Partial<IUser>): Promise<IUser> {
    const now = new Date();
    const newUser = {
      ...user,
      isActive: true,
      created_at: now,
      updated_at: now,
    };
    const [createdUser] = await knex<IUser>("users").insert(newUser).returning("*");
    if (!createdUser) {
      throw new Error("Erro ao criar usuário");
    }
    return createdUser;
  }

  async findOne(query: IUserQuery): Promise<IUser> {
    return knex("users").where(query)
      .select("id", "name", "email", "isActive", "created_at", "updated_at")
      .first();
  }

}

export default new User();