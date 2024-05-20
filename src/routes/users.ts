import { FastifyInstance } from 'fastify';
import UserController from '../controller/UserController';

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['name', 'email', 'password'],
};

const loginSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['email', 'password'],
};

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      summary: 'Registra um novo usuário',
      tags: ['Users'],
      body: userSchema,
      response: {
        201: {
          description: 'Usuário criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' },
                isActive: { type: 'boolean' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
              }
            }
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
    },
    handler: UserController.register,
  });

  app.post('/login', {
    schema: {
      summary: 'Realiza o login do usuário',
      tags: ['Users'],
      body: loginSchema,
      response: {
        200: {
          description: 'Login realizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' }
          }
        },
        400: {
          description: 'Credenciais inválidas',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: UserController.login,
  });
}
