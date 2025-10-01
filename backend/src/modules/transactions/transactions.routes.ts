import { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { TransactionsService } from "./transactions.service";
import {
  listTransactionsQuery,
  TransactionsListResponse,
  transactionIdParam,
  TransactionResponse,
} from "./transactions.schema";

const transactionsRoutes: FastifyPluginAsync = async (fastify) => {
  const svc = new TransactionsService(fastify.db);

  // ------------------- User: GET /transactions -------------------
  fastify.get(
    "/transactions",
    {
      preHandler: requireAuth(fastify),
      schema: { querystring: listTransactionsQuery, response: { 200: TransactionsListResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const q = listTransactionsQuery.parse(request.query);

      const result = await svc.listTransactions({
        page: q.page,
        limit: q.limit,
        filters: {
          userId,
          type: q.type,
          subtype: q.subtype,
          status: q.status,
          tokenSymbol: q.tokenSymbol,
          dateFrom: q.dateFrom,
          dateTo: q.dateTo,
        },
        sortBy: q.sortBy,
        sortDir: q.sortDir,
      });

      return reply.code(200).send(TransactionsListResponse.parse(result));
    }
  );

    // ------------------- User: GET /transactions/:id -------------------
  fastify.get(
    "/transactions/:id",
    {
      preHandler: requireAuth(fastify),
      schema: { params: transactionIdParam, response: { 200: TransactionResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const params = transactionIdParam.parse(request.params);

      const tx = await svc.getTransactionById(params.id);
      if (!tx) return reply.code(404).send({ error: "Transaction not found" });

      if (tx.userId !== userId) {
        const isAdmin = await svc.ensureAdmin(userId);
        if (!isAdmin) return reply.code(403).send({ error: "Forbidden" });
      }

      return reply.code(200).send(TransactionResponse.parse(tx));
    }
  );

    // ------------------- Admin: GET /admin/transactions -------------------
  fastify.get(
    "/admin/transactions",
    {
      preHandler: requireAuth(fastify),
      schema: { querystring: listTransactionsQuery, response: { 200: TransactionsListResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const isAdmin = await svc.ensureAdmin(userId);
      if (!isAdmin) return reply.code(403).send({ error: "Forbidden" });

      const q = listTransactionsQuery.parse(request.query);
      const result = await svc.listTransactions({
        page: q.page,
        limit: q.limit,
        filters: {
          type: q.type,
          subtype: q.subtype,
          status: q.status,
          tokenSymbol: q.tokenSymbol,
          dateFrom: q.dateFrom,
          dateTo: q.dateTo,
        },
        sortBy: q.sortBy,
        sortDir: q.sortDir,
      });

      return reply.code(200).send(TransactionsListResponse.parse(result));
    }
  );
};

export default transactionsRoutes;
