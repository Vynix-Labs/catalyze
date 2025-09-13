import { buildApp } from './src/app'

const start = async () => {
  const fastify = await buildApp()

  try {
    await fastify.listen({ port: 3000 })
    console.log('Server running at http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
