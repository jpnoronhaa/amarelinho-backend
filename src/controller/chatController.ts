import jwt from 'jsonwebtoken';
import MessageModel from '../models/MessageModel';
import User from '../models/User';
import admin from 'firebase-admin';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

const sendPushNotification = async (token: string, message: string) => {
  const payload = {
    data: {
      title: 'Nova Mensagem Recebida',
      body: message,
    },
    token: token,
  };
  await admin.messaging().send(payload);
};

export interface TokenPayload {
  token: string;
}

const userConnections: Map<number, WebSocket> = new Map();

/**
 * Função que gerencia a conexão de um usuário ao chat
 * A questão de marcar como lidas pode ser feita usando um endpoint que marca as mensagens como lidas,
 * isso para saber, do frontend, se o usuário leu a mensagem ou se só recebeu via websocket
 * 
 * @param connection WebSocket
 * @param request FastifyRequest<{ Querystring: TokenPayload }>
 * 
 * @returns void
 */
export const handleConnection = (connection, request: FastifyRequest<{ Querystring: TokenPayload }>) => {
  const { token } = request.query;

  if (!token) {
    console.error('Token JWT ausente ou inválido');
    connection.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; name: string };
    const userId = decoded.id;

    console.log(`Usuário conectado ao chat: ${userId}`);
    userConnections.set(userId, connection);

    (async () => {
      const unreadMessages = await MessageModel.getUnreadMessages(userId);
      connection.send(JSON.stringify({ type: 'receive_messages', messages: unreadMessages }));
      await MessageModel.markMessagesAsRead(userId);
    })();

    connection.on('message', async (message: string) => {
      const parsedMessage = JSON.parse(message);
      console.log('Mensagem recebida:', parsedMessage);

      if (parsedMessage.type === 'send_message') {
        const { receiverId, content } = parsedMessage;
        const newMessage = await MessageModel.addMessage(userId, receiverId, content);

        connection.send(JSON.stringify({ type: 'receive_message', message: newMessage }));
        console.log('Enviando mensagem ao remetente:', newMessage);

        const receiverSocket = userConnections.get(parseInt(receiverId));
        if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
          console.log('Enviando mensagem ao destinatário:', newMessage);
          receiverSocket.send(JSON.stringify({ type: 'receive_message', message: newMessage }));
        } else {
          const receiver = await User.findOne({ id: receiverId });
          if (receiver && receiver.notificationToken) {
            console.log('Enviando notificação ao destinatário:', newMessage);
            await sendPushNotification(receiver.notificationToken, newMessage.content);
          }
        }
      }
    });

    connection.on('close', () => {
      console.log(`Usuário desconectado do chat: ${userId}`);
      userConnections.delete(userId);
    });
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    connection.close();
  }
};
