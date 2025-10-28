import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().min(4),
    password: z.string().min(8)
})