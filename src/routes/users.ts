import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import  UserService  from '../services/UserService';
import { IUser } from '../models/User';
import { format } from 'path';

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
      handler: async (request: FastifyRequest<{ Body: IUser }>, reply: FastifyReply) => {
        try {
          const user = request.body;
          const createdUser = await UserService.create(user);
          return reply.code(201).send({ "message": "Usuário criado com sucesso", "user": createdUser });
        }
        catch (error) {
          if (error.message === 'Email já cadastrado') {
            return reply.code(409).send({"message": error.message});
          }
          return reply.code(400).send({"message": error.message});
        }
      }
    }
  );
}
