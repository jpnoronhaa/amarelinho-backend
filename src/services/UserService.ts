import bcrypt from 'bcrypt';
import User from '../models/User';
import { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { env } from '../env';

class UserService {
    async create(user: IUser): Promise<IUser> {
        const userExists = await User.findOne({ email: user.email });
        if (userExists) {
            throw new Error('Email já cadastrado');
        }
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = await User.create(user);
        return newUser;
    }

    async login(email: string, password: string): Promise<string> {
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

        return token;
    }
}

export default new UserService();