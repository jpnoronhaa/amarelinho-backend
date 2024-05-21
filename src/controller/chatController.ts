// src/controllers/ChatController.ts
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import MessageModel from '../models/MessageModel';
import User from '../models/User'; // Modelo de usuário para verificar autenticidade

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

// Controlador para gerenciar conexões do chat
export const handleConnection = (io: Server) => async (socket: Socket) => {
  const token = socket.handshake.query.token as string;

  if (!token) {
    console.error('Token JWT ausente ou inválido');
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; name: string };

    const user = await User.findOne({ id: decoded.id });

    if (!user) {
      console.error('Usuário não encontrado ou não autorizado');
      socket.disconnect();
      return;
    }

    console.log(`Usuário conectado ao chat: ${user.name}`);

    socket.on('mensagem', (content: string) => {
      const newMessage = MessageModel.addMessage(content, user.name);
      io.emit('mensagem', `${user.name}: ${newMessage.content}`);
    });

    socket.on('disconnect', () => {
      console.log(`Usuário desconectado do chat: ${user.name}`);
    });
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    socket.disconnect();
  }
};
