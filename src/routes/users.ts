import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    async (request) => {
      const message = 'JP'
      return { message }
    },
  )
}
