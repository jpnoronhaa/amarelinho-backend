import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/User";
import { env } from '../env';

interface LoginBody {
    email: string;
    password: string;
}

interface RegisterNotificationTokenBody {
    userId: number;
    notificationToken: string;
}

class UserController {
    register = async (req: FastifyRequest<{ Body: IUser }>, res: FastifyReply) => {
        try {
            const user = req.body;
            const userExists = await User.findOne({ email: user.email });
            if (userExists) {
                throw new Error('Email já cadastrado');
            }
            user.password = await bcrypt.hash(user.password, 10);
            const createdUser = await User.create(user);
            const userWithoutPassword = { ...createdUser, password: undefined };
            return res.code(201).send({ message: 'Usuário criado com sucesso', user: userWithoutPassword });
        } catch (error) {
            if (error.message === 'Email já cadastrado') {
                return res.code(409).send({ message: error.message });
            }
            return res.code(400).send({ message: error.message });
        }
    }

    login = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Credenciais inválidas');
            }

            const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
                expiresIn: env.JWT_EXPIRES_IN
            });

            return res.code(200).send({ token });
        } catch (error) {
            return res.code(401).send({ message: error.message });
        }
    }

    registerNotificationToken = async (req: FastifyRequest<{ Body: RegisterNotificationTokenBody }>, res: FastifyReply) => {
        const { userId, notificationToken } = req.body;

        try {
            await User.updateNotificationToken(userId, notificationToken);
            return res.code(200).send({ message: 'Token de notificação atualizado com sucesso' });
        } catch (error) {
            return res.code(400).send({ message: 'Erro ao atualizar token de notificação' });
        }
    }

    getUserById = async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
        const userId = req.params.id;
        try {
            const user = await User.findOne({ id: userId });
            return res.code(200).send(user);
        } catch (error) {
            return res.code(400).send({ message: 'Erro ao buscar usuário' });
        }
    }
}

export default new UserController();
