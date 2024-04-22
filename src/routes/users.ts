import { FastifyInstance } from 'fastify';
import UserController from '../controller/UserController';

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email'},
    password: { type: 'string', minLength: 6 },
  },
  required: ['name', 'email', 'password'],
};

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    async (request) => {
      const message = 'Endpoints de usuários'
      return { message }
    },
  );

  app.post(
    '/register', {
      schema: {
        body: userSchema,
      },
      handler: UserController.register,
    }
  );

  app.post('/login', UserController.login); 
}
