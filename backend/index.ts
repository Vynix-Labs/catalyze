import { buildApp } from './src/app'

const start = async () => {
  const fastify = await buildApp()

  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' })
    console.log('Server running at http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
