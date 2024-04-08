import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import  UserService  from '../services/UserService';
import { IUser } from '../models/User';
import { format } from 'path';
import { authenticateUser } from '../utils';

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
  // autenticação e geração de token JWT
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // verifica se o email e senha foram fornecidos
  if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  // verifica os dados do usuário
  const user = authenticateUser(email, senha);
  if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  // gera um token JWT
  const token = jwt.sign({ userId: user.id, email: user.email }, 'secreto', { expiresIn: '1h' });

  res.json({ token });
});
  
}
