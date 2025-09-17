import { FastifyPluginAsync } from "fastify";
import { verifyPinSchema, setPinSchema } from "./auth.schema";
import { setUserPin, verifyUserPin } from "./auth.service";
import { requireAuth } from "../../plugins/requireAuth";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // ------------------- SET PIN -------------------
  fastify.post(
    "/set-pin",
    {
      preHandler: requireAuth(fastify),
      schema: {
        body: setPinSchema,
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).currentUserId as string;
        const { pin } = setPinSchema.parse(request.body);
        await setUserPin(fastify, userId, pin);
        return reply.code(201).send({ success: true, message: "PIN set successfully" });
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({ error: err.message });
      }
    }
  );

  // ------------------- VERIFY PIN -------------------
  fastify.post(
    "/verify-pin",
    {
      preHandler: requireAuth(fastify),
      schema: {
        body: verifyPinSchema,
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).currentUserId as string;
        const { pin } = verifyPinSchema.parse(request.body);
        await verifyUserPin(fastify, { userId, pin });
        return reply.send({ success: true, message: "PIN verified successfully" });
      } catch (err: any) {
        return reply.code(400).send({ error: err.message });
      }
    }
  );
};

export default authRoutes;
