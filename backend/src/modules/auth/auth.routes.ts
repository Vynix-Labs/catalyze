import type { FastifyPluginAsync } from "fastify";
import { verifyPinSchema, setPinSchema, verifyPinResponseSchema } from "./auth.schema";
import { SuccessMessageResponse, ErrorResponse } from "../../schemas/common";
import { setUserPin, verifyUserPin } from "./auth.service";
import { requireAuth } from "../../plugins/requireAuth";
import { issuePinToken } from "../../utils/pinToken";

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
          201: SuccessMessageResponse,
          400: ErrorResponse,
          401: ErrorResponse,
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
          200: verifyPinResponseSchema,
          400: ErrorResponse,
          401: ErrorResponse,
        }
      },
    },
    async (request, reply) => {
      try {
        const userId = request.currentUserId as string;
        const { pin, scope } = verifyPinSchema.parse(request.body);
        await verifyUserPin(fastify, { userId, pin });
        const resolvedScope = scope ?? "any";
        const tokenPayload = await issuePinToken(fastify, userId, resolvedScope);
        return reply.send(
          verifyPinResponseSchema.parse({
            success: true,
            token: tokenPayload.token,
            expiresIn: tokenPayload.expiresIn,
            scope: resolvedScope,
          })
        );
      } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send({ error: (err as Error).message });
      }
    }
  );
};

export default authRoutes;
