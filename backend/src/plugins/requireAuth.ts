import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";

export function requireAuth(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!fastify.auth || typeof fastify.auth.api.getSession !== "function") {
      return reply.code(500).send({ error: "Auth plugin not available" });
    }

    const session = await fastify.auth.api.getSession({
      cookie: request.cookies,
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    (request as any).currentUserId = session.user.id;
  };
}
