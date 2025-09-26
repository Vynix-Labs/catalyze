import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { fromNodeHeaders } from "better-auth/node"
import type { User } from "./auth";

export function requireAuth(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!fastify.auth || typeof fastify.auth.api.getSession !== "function") {
      return reply.code(500).send({ error: "Auth plugin not available" });
    }
    const headers = fromNodeHeaders(request.headers);
    const session = await fastify.auth.api.getSession({
      headers,
    });

    if (!session?.user?.id) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    request.currentUserId = session.user.id;
    request.currentUser = session.user;
  };
}

declare module "fastify" {
  interface FastifyRequest {
    currentUserId?: string;
    currentUser?: User;
  }
}
