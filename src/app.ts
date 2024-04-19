import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { professionalRoutes } from './routes/professional'
import { categoryRoutes } from './routes/category'
import fastifyCookie from '@fastify/cookie'
import { reviewRoutes } from './routes/review'

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

export default app
