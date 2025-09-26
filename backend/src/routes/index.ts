import type { FastifyPluginAsync } from 'fastify'
import authRoutes from '../modules/auth/auth.routes'
/* 
import cryptoRoutes from '../modules/crypto/crypto.routes'
import fiatRoutes from '../modules/fiat/fiat.routes'
import stakingRoutes from '../modules/staking/staking.routes'
import transactionsRoutes from '../modules/transactions/transactions.routes'
import usersRoutes from '../modules/users/users.routes' 
*/

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: '/auth' })
  /*
  fastify.register(cryptoRoutes, { prefix: '/crypto' })
  fastify.register(fiatRoutes, { prefix: '/fiat' })
  fastify.register(stakingRoutes, { prefix: '/staking' })
  fastify.register(transactionsRoutes, { prefix: '/transactions' })
  fastify.register(usersRoutes, { prefix: '/users' }) */

  // Root endpoint
  fastify.get('/', async () => {
    return { message: 'Welcome to Catalyze API' }
  })
}

export default routes
