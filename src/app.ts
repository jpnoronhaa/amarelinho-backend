import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { professionalRoutes } from './routes/professional'
import { categoryRoutes } from './routes/category'
import fastifyCookie from '@fastify/cookie'
import { reviewRoutes } from './routes/review'
import { userImagesRoutes } from './routes/UserImages'
import fastifyMultipart from "@fastify/multipart";
import bucket from './firebase';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { chatRoutes } from './routes/chatRoutes';
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

const app = fastify({ logger: true });

app.register(fastifyCookie);

app.register(fastifyMultipart);

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Amarelinho API',
      description: 'API para o projeto Amarelinho',
      version: '1.0.0',
    },
    tags: [
      { name: 'Users', description: 'Operações relacionadas a usuários' },
      { name: 'Categories', description: 'Operações relacionadas a categorias' },
      { name: 'Professionals', description: 'Operações relacionadas a profissionais' },
      { name: 'Reviews', description: 'Operações relacionadas a revisões' },
      { name: 'User Images', description: 'Operações relacionadas a imagens de usuários' },
      { name: 'Chat', description: 'Operações relacionadas a chat' },
    ],
    externalDocs: {
      description: 'Repositório no GitHub',
      url: 'https://github.com/rafaeld74/Amarelinho-PS'
    }
  }
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(categoryRoutes, {
  prefix: 'category',
})

app.register(professionalRoutes, {
  prefix: 'professional',
})

app.register(reviewRoutes, {
  prefix: 'review',
})

app.register(userImagesRoutes, {
  prefix: 'user_images',
})

app.register(chatRoutes, {
  prefix: 'chat',
})

export default app
