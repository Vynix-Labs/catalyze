import Fastify from 'fastify'
import dbPlugin from './plugins/db'
import authPlugin from './plugins/auth'
import routes from './routes' // central route aggregator

export const buildApp = async () => {
  const fastify = Fastify({
    logger: true
  })

  // Register plugins
  await fastify.register(dbPlugin)
  await fastify.register(authPlugin)

  // Register all routes
  fastify.register(routes, { prefix: '/api' })

  return fastify
}
