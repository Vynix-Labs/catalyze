import { z } from "zod";

export const SuccessResponse = z.object({ success: z.boolean() });
export const ErrorResponse = z.object({ error: z.string() });
export const SuccessMessageResponse = z.object({ success: z.boolean(), message: z.string() });

export type TSuccessResponse = z.infer<typeof SuccessResponse>;
export type TErrorResponse = z.infer<typeof ErrorResponse>;
export type TSuccessMessageResponse = z.infer<typeof SuccessMessageResponse>;
