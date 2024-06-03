import fastify from 'fastify'

const server = fastify()

server.get('/', async (request, reply) => {
  return { hello: 'world' }
})

server.listen(env.PORT, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})