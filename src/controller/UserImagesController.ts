import { FastifyRequest, FastifyReply } from "fastify";
import UserImages, { IUserImage } from "../models/UserImages";

class UserImagesController {
  constructor(private userImagesModel = new UserImages()) {}

  createImage = async (
    req: FastifyRequest<{ Body: { user_id: number; image_path: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { user_id, image_path } = req.body;

      if (!user_id || !image_path) {
        return res.code(400).send({
          message: "Invalid request: user_id and image_path are required",
        });
      }

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
    req: FastifyRequest<{ Params: { id: number }; Body: { image_path: string } }>,
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;
      const { image_path } = req.body;

      if (!image_path) {
        return res.code(400).send({
          message: "Invalid request: image_path is required",
        });
      }

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
    req: FastifyRequest<{ Params: { id: number } }>,
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
