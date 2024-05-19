import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { professionalRoutes } from './routes/professional'
import { categoryRoutes } from './routes/category'
import fastifyCookie from '@fastify/cookie'
import { reviewRoutes } from './routes/review'
import { chatRoutes } from './routes/chatRoutes'
import { userImagesRoutes } from './routes/userImages'

const app = fastify()

app.register(fastifyCookie)

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

app.register(chatRoutes, {
  prefix: 'chat',
})

app.register(userImagesRoutes, {
  prefix: 'userImages',
});

export default app
