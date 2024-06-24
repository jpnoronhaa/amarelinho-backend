import { FastifyRequest, FastifyReply } from "fastify";
import UserImages from "../models/UserImages";
import bucket from "../firebase";
import { Readable } from 'stream';
import * as path from 'path';

export interface MulterFile {
  buffer: Buffer;
  originalname: string;
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

  private async uploadToFirebase(file: MulterFile): Promise<string> {
    const stream = Readable.from(file.buffer);
    const fileName = Date.now() + '-' + file.originalname;

    const fileUpload = bucket.file(fileName);

    await new Promise((resolve, reject) => {
      stream.pipe(fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        }
      }))
      .on('finish', resolve)
      .on('error', reject);
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '01-01-2400',
    });

    return url;
  }

  private validateFile(file: MulterFile): string | null {
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxFileSize) {
      return "O tamanho do arquivo excede o limite de 2MB";
    }
    if (!file.mimetype.startsWith("image/")) {
      return "O arquivo não é uma imagem";
    }
    return null;
  }

  public createImage = async (
    req: FastifyRequest<{ Body: { user_id: number } }> & { file: MulterFile },
    res: FastifyReply
  ) => {
    try {
      const { user_id } = req.body;
      const file = req.file;

      if (!user_id || !file) {
        return res.code(400).send({
          message: "Request inválido: user_id e arquivo de imagem são obrigatórios",
        });
      }

      const validationError = this.validateFile(file);
      if (validationError) {
        return res.code(400).send({
          message: `Request inválido: ${validationError}`,
        });
      }

      const url = await this.uploadToFirebase(file);

      const createdImage = await this.userImagesModel.create({
        user_id,
        image_path: url,
      });

      req.log.info(`Imagem criada: ${createdImage.id}`);
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

  public updateImage = async (
    req: FastifyRequest<{ Params: { id: number } }> & { file: MulterFile },
    res: FastifyReply
  ) => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.code(400).send({
          message: "Request inválido: arquivo de imagem é obrigatório",
        });
      }

      const validationError = this.validateFile(file);
      if (validationError) {
        return res.code(400).send({
          message: `Request inválido: ${validationError}`,
        });
      }

      const existingImage = await this.userImagesModel.findOne({ id });
      if (!existingImage) {
        return res.code(404).send({
          message: `Imagem com ID ${id} não encontrada`,
        });
      }

      const url = await this.uploadToFirebase(file);

      const updatedImage = await this.userImagesModel.update(id, {
        image_path: url,
      });

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

  public deleteImage = async (
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

      const filename = path.basename(existingImage.image_path);
      await bucket.file(filename).delete();

      await this.userImagesModel.delete(id);

      req.log.info(`Imagem deletada: ${id}`);
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

  public getImages = async (
    req: FastifyRequest<{ Querystring: { user_id: number } }>,
    res: FastifyReply
  ) => {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.code(400).send({
          message: "Request inválido: user_id é obrigatório",
        });
      }

      const image = await this.userImagesModel.findOne({ user_id });

      if (!image) {
        return res.code(404).send({
          message: "Imagem não encontrada",
        });
      }

      return res.code(200).send(image);
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return res.code(500).send({
        message: "Erro interno do servidor: Falha ao buscar imagem",
      });
    }
  };
}

export default new UserImagesController();
