import type { FastifyPluginAsync } from 'fastify'
import { TRADING_FEES } from '../../config'

const feesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/trading', async () => {
    return TRADING_FEES
  })
}

export default feesRoutes
