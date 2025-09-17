import { FastifyPluginAsync } from 'fastify'
import { betterAuth }from 'better-auth';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const auth = betterAuth({
    secret: process.env.JWT_SECRET!,
    //include other options

  // Make auth available on Fastify
  fastify.decorate('auth', auth)
}

export default authPlugin
