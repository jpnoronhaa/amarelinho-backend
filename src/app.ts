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

const app = fastify({ logger: true });

app.register(fastifyCookie);

app.register(fastifyMultipart);

app.register(fastifySwagger);
app.register(fastifySwaggerUi, {
  prefix: '/docs',
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

export default app