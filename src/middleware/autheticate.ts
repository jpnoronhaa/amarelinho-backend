import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../env';

interface AuthRequest extends FastifyRequest {
    user?: { id: number };
}

//isso aqui ainda está errado
//deve servir para verificar se o token é válido
//se for, o usuário está autenticado e pode usar a rota protegida (se tiver uma assim)
export const authenticate = async (req: AuthRequest, reply: FastifyReply) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Token não fornecido');	
        }

        const token = authHeader.split(' ')[1];

        if(!token) {
            throw new Error('Token não fornecido');
        }

        jwt.verify(token, env.JWT_SECRET);

        return true;
    }
    catch (error) {
        reply.code(401).send({ error: 'Não autorizado' });
    }
}