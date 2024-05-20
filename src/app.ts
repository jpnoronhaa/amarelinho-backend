import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { professionalRoutes } from './routes/professional'
import { categoryRoutes } from './routes/category'
import fastifyCookie from '@fastify/cookie'
import { reviewRoutes } from './routes/review'
import { userImagesRoutes } from './routes/UserImages'
import fastifyMultipart from "@fastify/multipart";
import bucket from './firebase';
import { chatRoutes } from './routes/chatRoutes'
import { userImagesRoutes } from './routes/userImages'
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

const app = fastify({ logger: true });

app.register(fastifyCookie);

app.register(fastifyMultipart);

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
