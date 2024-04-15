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
    const user = await knex<IUser>("users").where(query).first();
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  }

}

export default new User();