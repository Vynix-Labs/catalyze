import { eq, and, gte, lte, sql, asc, desc } from "drizzle-orm";
import { transactions, user } from "../../db/schema";
import { randomUUID } from "crypto";

export class TransactionsService {
  db: any;
  constructor(db: any) {
    this.db = db;
  }

  async createTransaction(payload: {
    userId: string;
    type: string;
    subtype?: string | null;
    tokenSymbol: string;
    amountToken: string | number;
    amountFiat?: string | number | null;
    status?: string;
    reference?: string | null;
    txHash?: string | null;
    metadata?: any | null;
  }) {
    const row = {
      id: randomUUID(),
      userId: payload.userId,
      type: payload.type,
      subtype: payload.subtype ?? null,
      tokenSymbol: payload.tokenSymbol,
      amountToken: payload.amountToken.toString(),
      amountFiat: payload.amountFiat != null ? String(payload.amountFiat) : null,
      status: payload.status ?? "pending",
      reference: payload.reference ?? randomUUID(),
      txHash: payload.txHash ?? null,
      metadata: payload.metadata ?? null,
    };

    await this.db.insert(transactions).values(row);
    return structuredClone(row);
  }

  async getTransactionById(id: string) {
    const [row] = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    // conver date i row
    const items = row
      ? {
          ...structuredClone(row),
          createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
          updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
        }
      : null;

    return items || null;
  }

  async listTransactions(opts: {
    page?: number;
    limit?: number;
    filters?: {
      userId?: string;
      type?: string;
      subtype?: string;
      status?: string;
      tokenSymbol?: string;
      dateFrom?: string;
      dateTo?: string;
    };
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.max(1, Math.min(opts.limit ?? 20, 200));

    const whereClauses: any[] = [];
    const f = opts.filters;
    if (f?.userId) whereClauses.push(eq(transactions.userId, f.userId));
    if (f?.type) whereClauses.push(eq(transactions.type, f.type as any));
    if (f?.subtype) whereClauses.push(eq(transactions.subtype, f.subtype as any));
    if (f?.status) whereClauses.push(eq(transactions.status, f.status as any));
    if (f?.tokenSymbol) whereClauses.push(eq(transactions.tokenSymbol, f.tokenSymbol));
    if (f?.dateFrom) whereClauses.push(gte(transactions.createdAt, new Date(f.dateFrom)));
    if (f?.dateTo) whereClauses.push(lte(transactions.createdAt, new Date(f.dateTo)));

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(whereClauses.length ? and(...whereClauses) : undefined);

    const total = Number(count ?? 0);
    const totalPages = Math.ceil(total / limit);

    const sortCol =
      opts.sortBy === "amountFiat"
        ? transactions.amountFiat
        : opts.sortBy === "amountToken"
        ? transactions.amountToken
        : transactions.createdAt;

    const rows = await this.db
        .select()
        .from(transactions)
        .where(whereClauses.length ? and(...whereClauses) : undefined)
        .orderBy((opts.sortDir ?? "desc") === "asc" ? asc(sortCol) : desc(sortCol))
        .limit(limit)
        .offset((page - 1) * limit);

    const items = rows.map((r: any) => ({
        ...structuredClone(r),
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
    }));

    return {
      items: items,
      meta: { page, limit, total, totalPages },
    };
  }

  // Role check 
  async ensureAdmin(userId: string): Promise<boolean> {
    const [u] = await this.db.select().from(user).where(eq(user.id, userId));
    return !!u && u.role === "admin";
  }
}
