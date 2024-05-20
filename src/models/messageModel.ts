// src/models/MessageModel.ts
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

export interface IMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

class MessageModel {
  private messages: IMessage[] = []; // Armazena as mensagens em memória

  // Adiciona uma nova mensagem ao modelo
  addMessage(content: string, sender: string): IMessage {
    const newMessage: IMessage = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date(),
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  // Retorna todas as mensagens
  getMessages(): IMessage[] {
    return this.messages;
  }
}

export default new MessageModel();
