import {z} from "zod";

export const CreateUserSchema = z.object({
        username: z.string().min(3).max(20),
        password: z
        .string()
        .min(4)
        .max(50)
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"}),
        email: z.email()
    })

export const SignInSchema = z.object({
        username: z.string().min(3).max(20),
        password: z
        .string()
        .min(4)
        .max(50)
    })

export const CreateRoomSchema = z.object({
    room: z.string().min(3).max(50)
})