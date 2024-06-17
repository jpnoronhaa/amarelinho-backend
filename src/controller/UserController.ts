import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../services/UserService";
import { IUser } from "../models/User";

interface LoginBody {
    email: string;
    password: string;
}

class UserController {
    register = async (req: FastifyRequest<{ Body: IUser }>, res: FastifyReply) => {
        try {
            const user = req.body;
            const createdUser = await UserService.create(user);
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
            const token = await UserService.login(email, password);
            return res.code(200).send({ token });
        } catch (error) {
            return res.code(401).send({ message: error.message });
        }
    }
}

export default new UserController();