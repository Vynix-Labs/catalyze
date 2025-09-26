import type { FastifyPluginAsync } from "fastify";
import { verifyPinSchema, setPinSchema } from "./auth.schema";
import { setUserPin, verifyUserPin } from "./auth.service";
import { requireAuth } from "../../plugins/requireAuth";

/**
 * 
 * @param fastify 
 */
const authRoutes: FastifyPluginAsync = async (fastify) => {
  // ------------------- SET PIN -------------------
  fastify.post(
    "/set-pin",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: 'Set a 4-digit PIN for the authenticated user',
        tags: ['Authentication'],
        security: [{ sessionCookie: [] }],
        body: setPinSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      },
    },
    async (request, reply) => {
      try {
        const userId = request.currentUserId!;
        const { pin } = setPinSchema.parse(request.body);
        await setUserPin(fastify, userId, pin);
        return reply.code(201).send({ success: true, message: "PIN set successfully" });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send({ error: (err as Error).message });
      }
    }
  );

  // ------------------- VERIFY PIN -------------------
  fastify.post(
    "/verify-pin",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: 'Verify a 4-digit PIN for the authenticated user',
        tags: ['Authentication'],
        security: [{ sessionCookie: [] }],
        body: verifyPinSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' }
            }
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          }
        }
      },
    },
    async (request, reply) => {
      try {
        const userId = request.currentUserId as string;
        const { pin } = verifyPinSchema.parse(request.body);
        await verifyUserPin(fastify, { userId, pin });
        return reply.send({ success: true, message: "PIN verified successfully" });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send({ error: (err as Error).message });
      }
    }
  );
};

export default authRoutes;
