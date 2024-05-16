import { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import UserImagesController from "../controller/UserImagesController";
import {  DeleteImageRequest } from "../controller/UserImagesController";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido'), false);
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // max: 2MB
  fileFilter
});


export async function userImagesRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    return reply.send({
      message: "Bem-vindo ao endpoint de imagens de usuários",
    });
  });

  app.post(
    "/",
    { preHandler: upload.single("image") }, // Middleware de multer para upload de arquivo
    async (request, reply) => {
      await UserImagesController.createImage(request as any, reply);
    }
  );

  app.put(
    "/:id",
    { preHandler: upload.single("image") }, // Middleware de multer para upload de arquivo
    async (request, reply) => {
      await UserImagesController.updateImage(request as any, reply);
    }
  );

  app.delete("/:id", async (request, reply) => {
    await UserImagesController.deleteImage(request as DeleteImageRequest, reply);
  });
}
