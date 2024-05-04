import { FastifyInstance } from "fastify";
import multer from "multer";
import UserImagesController from "../controller/UserImagesController";

const upload = multer({ dest: "uploads/" }); // Diretório para uploads de arquivos

export async function userImagesRoutes(app: FastifyInstance) {
  app.get(
    "/",
    async (request, reply) => {
      return reply.send({
        message: "Bem-vindo ao endpoint de imagens de usuários",
      });
    }
  );

  app.post(
    "/user_images",
    {
      preHandler: upload.single("image"), // Usa multer para upload de arquivo
    },
    UserImagesController.createImage
  );

  app.put(
    "/user_images/:id",
    {
      preHandler: upload.single("image"), // Para atualização, requer um arquivo
    },
    UserImagesController.updateImage
  );

  app.delete(
    "/user_images/:id",
    UserImagesController.deleteImage
  );
}
