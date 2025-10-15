import type { FastifyPluginAsync } from 'fastify'
import authRoutes from '../modules/auth/auth.routes'
import transactionsRoutes from '../modules/transactions/transactions.routes'
import fiatRoutes from '../modules/fiat/fiat.routes'
import usersRoutes from '../modules/users/users.routes'
import cryptoRoutes from '../modules/crypto/crypto.routes'
import stakingRoutes from '../modules/staking/staking.routes'
import ratesRoutes from '../modules/rates/rates.routes'
import feesRoutes from '../modules/fees/fees.routes'
import assetsRoutes from '../modules/assets/assets.routes'
import waitlistRoutes from '../modules/waitlist/waitlist.routes'

/* 




*/

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(transactionsRoutes, { prefix: '' })
  fastify.register(fiatRoutes, { prefix: '/fiat' })
  fastify.register(usersRoutes, { prefix: '/users' })
  fastify.register(cryptoRoutes, { prefix: '/crypto' })
  fastify.register(stakingRoutes, { prefix: '/staking' })
  fastify.register(ratesRoutes, { prefix: '/rates' })
  fastify.register(assetsRoutes, { prefix: '/assets' })
  fastify.register(feesRoutes, { prefix: '/fees' })
  fastify.register(waitlistRoutes, { prefix: '/waitlist' })
  /*
  
  
  
  
   */

  // Root endpoint
  fastify.get('/', async () => {
    return { message: 'Welcome to Catalyze API' }
  })
}

export default routes
