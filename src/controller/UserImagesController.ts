import { FastifyRequest, FastifyReply } from "fastify";
import UserImages, { IUserImage } from "../models/UserImages";

export interface MulterFile {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface DeleteImageRequest extends FastifyRequest {
  params: {
    id: number;
  };
}

class UserImagesController {
  constructor(private userImagesModel = new UserImages()) {}

  createImage = async (
    req: FastifyRequest<{ Body: { user_id: number } }> & { file: MulterFile },
    res: FastifyReply
  ) => {
    try {
      const { user_id } = req.body;
      const file = req.file;

      if (!user_id || !file) {
        return res.code(400).send({
          message: "Invalid request: user_id and image file are required",
        });
      }

      const maxFileSize = 2 * 1024 * 1024;
      if (file.size > maxFileSize) {
        return res.code(400).send({
          message: "Request inválido: o tamanho do arquivo excede o limite de 2MB",
        });
      }
      if (!file.mimetype.startsWith("image/")) {
        return res.code(400).send({
          message: "Request inválido: o arquivo não é uma imagem",
        });
      }


      const image_path = file.path;

      const createdImage = await this.userImagesModel.create({
        user_id,
        image_path,
      });

      return res.code(201).send({
        message: "Imagem criada com sucesso",
        image: createdImage,
      });
    } catch (error) {
      console.error("Error creating image:", error);
      return res.code(500).send({
        message: "Internal Server Error: Failed to create image",
      });
    }
  };

  updateImage = async (
    req: FastifyRequest<{ Params: { id: number } }> & { file: MulterFile },
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.code(400).send({
          message: "Invalid request: image file is required",
        });
      }

      const maxFileSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxFileSize) {
        return res.code(400).send({
          message: "Request inválido: o tamanho do arquivo excede o limite de 2MB",
        });
      }
      if (!file.mimetype.startsWith("image/")) {
        return res.code(400).send({
          message: "Request inválido: o arquivo não é uma imagem",
        });
      }

      const image_path = file.path;

      const updatedImage = await this.userImagesModel.update(id, {
        image_path,
      });

      if (!updatedImage) {
        return res.code(404).send({
          message: `Image with ID ${id} not found`,
        });
      }

      return res.code(200).send({
        message: "Imagem atualizada com sucesso",
        image: updatedImage,
      });
    } catch (error) {
      console.error("Error updating image:", error);
      return res.code(500).send({
        message: "Internal Server Error: Failed to update image",
      });
    }
  };

  deleteImage = async (
    req: DeleteImageRequest,
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;

      const existingImage = await this.userImagesModel.findOne({ id });
      if (!existingImage) {
        return res.code(404).send({
          message: `Imagem com ID ${id} não encontrada`,
        });
      }

      await this.userImagesModel.delete(id);

      return res.code(200).send({
        message: "Imagem deletada com sucesso",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      return res.code(500).send({
        message: "Internal Server Error: Failed to delete image",
      });
    }
  };
}

export default new UserImagesController();