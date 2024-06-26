import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config({ path: '.env' })
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_HOST: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment!', _env.error.format())
  throw new Error('Invalid environment')
}

export const env = _env.data
