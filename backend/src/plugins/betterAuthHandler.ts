import { FastifyPluginAsync } from "fastify";
import { auth } from "./auth"; // Better Auth instance

const betterAuthHandler: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    url: "/auth/*",
    async handler(request, reply) {
      try {
        // Construct full URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        // Build Fetch-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        // Call Better Auth handler
        const response = await auth.handler(req);

        // Set status code and headers
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));

        // Parse JSON if content-type is JSON
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const json = await response.json();
          reply.send(json);
        } else {
          // fallback for plain text or other responses
          const text = await response.text();
          reply.send(text);
        }
      } catch (error) {
        fastify.log.error("Authentication Error:", error);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });
};

export default betterAuthHandler;
