import 'fastify';

declare module 'fastify' {
  interface FastifySchema {
    summary?: string;
  }
}
