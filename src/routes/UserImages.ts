import { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import UserImagesController from "../controller/UserImagesController";
import {  DeleteImageRequest } from "../controller/UserImagesController";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max: 2MB
  fileFilter
});


export async function userImagesRoutes(app: FastifyInstance) {
  app.get(
    "/", 
    {
      schema: {
        summary: 'Obtém a imagem de usuário',
        tags: ['User Images'],
        querystring: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
          },
          required: ['user_id']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              user_id: { type: 'number' },
              image_path: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          },
          404: {
            description: 'Imagem não encontrada',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          },
          400: {
            description: 'Request inválido',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, async (request, reply) => {
      await UserImagesController.getImages(request as any, reply);
    }
  );

  app.post(
    "/",
    {
      preHandler: upload.single("image"),
      schema: {
        summary: 'Cria uma nova imagem de usuário',
        tags: ['User Images'],
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          required: ['user_id'],
          properties: {
            user_id: { type: 'number' },
            image: { type: 'string', format: 'binary' }
          }
        },
        response: {
          201: {
            description: 'Imagem criada com sucesso',
            type: 'object',
            properties: {
              message: { type: 'string' },
              image: { type: 'object' }
            }
          },
          400: {
            description: 'Request inválido',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, // Middleware de multer para upload de arquivo
    async (request, reply) => {
      await UserImagesController.createImage(request as any, reply);
    }
  );

  app.put(
    "/:id",
    {
      preHandler: upload.single("image"),
      schema: {
        summary: 'Atualiza uma imagem de usuário',
        tags: ['User Images'],
        consumes: ['multipart/form-data'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' }
          }
        },
        body: {
          type: 'object',
          properties: {
            image: { type: 'string', format: 'binary' }
          }
        },
        response: {
          200: {
            description: 'Imagem atualizada com sucesso',
            type: 'object',
            properties: {
              message: { type: 'string' },
              image: { type: 'object' }
            }
          },
          400: {
            description: 'Request inválido',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, // Middleware de multer para upload de arquivo
    async (request, reply) => {
      await UserImagesController.updateImage(request as any, reply);
    }
  );

  app.delete("/:id", {
    schema: {
      summary: 'Deleta uma imagem de usuário',
      tags: ['User Images'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          description: 'Imagem deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Imagem não encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    await UserImagesController.deleteImage(request as DeleteImageRequest, reply);
  });
}
