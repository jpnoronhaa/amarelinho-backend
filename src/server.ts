// src/server.ts
import fastify from 'fastify';
import dotenv from 'dotenv';
import { chatRoutes } from './routes/chatRoutes'; // Rota para o chat

dotenv.config(); // Carregar variáveis de ambiente

const app = fastify();

// Registrar as rotas do chat
app.register(chatRoutes, { prefix: '/chat' });

const PORT = process.env.PORT || 3000;

// Iniciar o servidor
app.listen(PORT, (err, address) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }

  console.log(`Servidor Fastify rodando em ${address}`);
});