import type { FastifyPluginAsync } from 'fastify'
import authRoutes from '../modules/auth/auth.routes'
import transactionsRoutes from '../modules/transactions/transactions.routes'
import fiatRoutes from '../modules/fiat/fiat.routes'
import usersRoutes from '../modules/users/users.routes'
import cryptoRoutes from '../modules/crypto/crypto.routes'
import stakingRoutes from '../modules/staking/staking.routes'

/* 




*/

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(transactionsRoutes, { prefix: '' })
  fastify.register(fiatRoutes, { prefix: '/fiat' })
  fastify.register(usersRoutes, { prefix: '/users' })
  fastify.register(cryptoRoutes, { prefix: '/crypto' })
  fastify.register(stakingRoutes, { prefix: '/staking' })
  /*
  
  
  
  
   */

  // Root endpoint
  fastify.get('/', async () => {
    return { message: 'Welcome to Catalyze API' }
  })
}

export default routes
