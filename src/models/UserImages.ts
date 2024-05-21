import { knex } from "../database";

export interface IUserImage {
  id?: number;
  user_id: number;
  image_path: string;
  created_at?: Date;
  updated_at?: Date;
}

interface IUserImageQuery {
  id?: number;
  user_id?: number;
}

class UserImages {
  async create(imageData: Partial<IUserImage>): Promise<IUserImage> {
    const now = new Date();
    const newImage = {
      ...imageData,
      created_at: now,
      updated_at: now,
    };

    const [createdImage] = await knex<IUserImage>("user_images")
      .insert(newImage)
      .returning("*");

    if (!createdImage) {
      throw new Error("Erro ao criar a imagem");
    }

    return createdImage;
  }

  async findOne(query: IUserImageQuery): Promise<IUserImage | null> {
    const result = await knex("user_images")
      .where(query)
      .select("id", "user_id", "image_path", "created_at", "updated_at")
      .first();

    return result;
  }

  async update(id: number, updateData: Partial<IUserImage>): Promise<IUserImage | null> {
    const updated = await knex("user_images")
      .where({ id })
      .update({ ...updateData, updated_at: new Date() })
      .returning("*");

    if (!updated) {
      throw new Error("Erro ao atualizar a imagem");
    }

    return updated[0];
  }

  async delete(id: number): Promise<void> {
    const deletedCount = await knex("user_images").where({ id }).delete();

    if (deletedCount === 0) {
      throw new Error(`Imagem com ID ${id} não encontrada`);
    }
  }
}

export default UserImages;
