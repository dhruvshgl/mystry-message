import {z} from 'zod'

export const signInSchema = z.object({
    identifier: z.string().min(6, {message: "code must be atleast 6 characters"}),
    password: z.string()
})