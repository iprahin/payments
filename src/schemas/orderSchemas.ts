import { z } from 'zod';

export const createOrderSchema = z.object({
    userId: z.number().int().positive(),
    amount: z.number().positive().gte(0.01),
    idempotencyKey: z.string().min(8)
})