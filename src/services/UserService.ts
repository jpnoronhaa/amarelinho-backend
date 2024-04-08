import bcrypt from 'bcrypt';
import User from '../models/User';
import { IUser } from '../models/User';

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
}

export default new UserService();