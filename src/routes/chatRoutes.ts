// src/routes/ChatRoutes.ts
import { FastifyInstance } from 'fastify';
import { handleConnection } from '../controller/ChatController';

export async function chatRoutes(app: FastifyInstance) {
  const io = require('socket.io')(app.server); // Configurar Socket.IO
  io.on('connection', handleConnection(io)); // Usar o controlador para gerenciar as conexões
}
