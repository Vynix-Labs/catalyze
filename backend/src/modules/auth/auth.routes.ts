import { FastifyPluginAsync } from "fastify";
import { registerSchema, verifyPinSchema } from "./auth.schema";
import { createUserWithPin, verifyUserPin } from "./auth.service";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);

    try {
      const authUser = await fastify.auth.emailAndPassword.register({
        email: body.email,
        password: body.password,
      });

      if (!authUser) {
        return reply.code(400).send({ error: "Registration failed" });
      }

      await createUserWithPin({
        betterAuthId: authUser.id,
        email: body.email,
        pin: body.pin,
      });

      const session = await fastify.auth.session.create(authUser.id);

      return reply.send({
        userId: authUser.id,
        email: body.email,
        token: session.token,
        expiresAt: session.expiresAt,
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.code(500).send({ error: err.message || "Registration error" });
    }
  });

  fastify.post("/verify-pin", async (request, reply) => { // remove /auth here
    const body = verifyPinSchema.parse(request.body);
    const userId = request.user?.id;

    if (!userId) return reply.code(401).send({ error: "Unauthorized" });

    try {
      await verifyUserPin({ userId, pin: body.pin });
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });
};

export default authRoutes;
