import { FastifyInstance, FastifyRequest } from 'fastify';
import MessageModel from '../models/MessageModel';
import { handleConnection, TokenPayload } from '../controller/ChatController';

export async function chatRoutes(app: FastifyInstance) {
  app.get('/conversations', {
    schema: {
      summary: 'Obtém a lista de conversas do usuário',
      tags: ['Chat'],
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId']
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'number' },
              lastMessage: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { userId } = request.query as any;
    const conversations = await MessageModel.getConversations(userId);
    reply.send(conversations);
  });

  app.get('/messages', {
    schema: {
      summary: 'Obtém mensagens entre dois usuários',
      tags: ['Chat'],
      querystring: {
        type: 'object',
        properties: {
          userId1: { type: 'number' },
          userId2: { type: 'number' },
        },
        required: ['userId1', 'userId2']
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              senderId: { type: 'number' },
              receiverId: { type: 'number' },
              content: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              read: { type: 'boolean' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { userId1, userId2 } = request.query as any;
    const messages = await MessageModel.getMessagesBetweenUsers(userId1, userId2);
    reply.send(messages);
  });

  app.get('/unread_messages', {
    schema: {
      summary: 'Obtém mensagens não lidas para um usuário',
      tags: ['Chat'],
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId']
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              senderId: { type: 'number' },
              receiverId: { type: 'number' },
              content: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              read: { type: 'boolean' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { userId } = request.query as any;
    const messages = await MessageModel.getUnreadMessages(userId);
    reply.send(messages);
  });

  app.get('/*', { websocket: true,
    schema: {
      summary: 'Conecta o usuário ao chat - WebSocket',
      tags: ['Chat'],
      querystring: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token']
      }
    }
  }, (socket /* WebSocket */, req /* FastifyRequest */) => {
    handleConnection(socket, req as FastifyRequest<{Querystring: TokenPayload}>);
  })
}
