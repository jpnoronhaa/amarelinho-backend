import { knex } from '../database';
import { v4 as uuidv4 } from 'uuid';

export interface IMessage {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  read: boolean; //necessário para saber o que carregar no websocket
}

class MessageModel {
  async addMessage(senderId: number, receiverId: number, content: string): Promise<IMessage> {
    const newMessage: IMessage = {
      id: uuidv4(),
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    };

    await knex('messages').insert(newMessage);
    return newMessage;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<IMessage[]> {
    return knex('messages')
      .where(function() {
        this.where('senderId', userId1).andWhere('receiverId', userId2);
      })
      .orWhere(function() {
        this.where('senderId', userId2).andWhere('receiverId', userId1);
      })
      .orderBy('timestamp', 'asc');
  }

  async getUnreadMessages(userId: number): Promise<IMessage[]> {
    return knex('messages')
      .where('receiverId', userId)
      .andWhere('read', false)
      .orderBy('timestamp', 'asc');
  }

  async markMessagesAsRead(userId: number): Promise<void> {
    await knex('messages')
      .where('receiverId', userId)
      .andWhere('read', false)
      .update({ read: true });
  }

  async getConversations(userId: number): Promise<any[]> {
    const sentMessages = await knex('messages')
      .where('senderId', userId)
      .select('receiverId as userId', 'content as lastMessage', 'timestamp');

    const receivedMessages = await knex('messages')
      .where('receiverId', userId)
      .select('senderId as userId', 'content as lastMessage', 'timestamp');

    const allMessages = [...sentMessages, ...receivedMessages];
    
    // mensagens por userId; pega a mais recente
    const conversations = allMessages.reduce((acc, msg) => {
      if (!acc[msg.userId] || acc[msg.userId].timestamp < msg.timestamp) {
        acc[msg.userId] = msg;
      }
      return acc;
    }, {});

    return Object.values(conversations);
  }
}

export default new MessageModel();
