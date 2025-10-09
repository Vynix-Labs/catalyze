import type { FastifyPluginAsync } from "fastify";
import { AssetsService } from "./assets.service";
import { AssetsResponseSchema } from "./assets.schema";

const assetsRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AssetsService();

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Assets"],
        summary: "List supported assets",
        response: {
          200: AssetsResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      const payload = service.supportedAssets();
      return reply.code(200).send(AssetsResponseSchema.parse(payload));
    }
  );
};

export default assetsRoutes;
