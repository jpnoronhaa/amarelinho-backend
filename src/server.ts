import app from './app'
import { env } from './env'
import { Server } from 'socket.io';
import { handleConnection } from './controller/ChatController';
import cors from '@fastify/cors';
import { FastifyRequest } from 'fastify';

// Habilitar CORS
app.register(cors, {
  origin: '*'
});

// Iniciar o servidor HTTP e WebSocket
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log('HTTP server and WebSocket server listening on port ' + env.PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
