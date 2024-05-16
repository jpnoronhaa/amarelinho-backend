import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { professionalRoutes } from './routes/professional'
import { categoryRoutes } from './routes/category'
import fastifyCookie from '@fastify/cookie'
import { reviewRoutes } from './routes/review'
import { userImagesRoutes } from './routes/UserImages'
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';
import fastifyMultipart from "@fastify/multipart";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const app = fastify();

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

export default app
