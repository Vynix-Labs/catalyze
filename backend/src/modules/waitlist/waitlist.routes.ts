import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { joinWaitlistSchema } from './waitlist.schema';
import { joinWaitlist } from './waitlist.service';

const waitlistRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.post(
    '/join',
    {
      schema: {
        tags: ['Waitlist'],
        description: 'Join the waitlist',
        body: joinWaitlistSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              alreadyExists: { type: 'boolean' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const result = await joinWaitlist(fastify, request.body);
      return reply.send(result);
    }
  );
};

export default waitlistRoutes;
