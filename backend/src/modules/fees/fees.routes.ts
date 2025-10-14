import type { FastifyPluginAsync } from 'fastify'

const feesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/trading', async () => {
    // Hardcoded 1% buy and 1% sell for now
    return {
      buyPercent: 1,
      sellPercent: 1,
    }
  })
}

export default feesRoutes
