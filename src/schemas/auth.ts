import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .refine((v) => /[a-zA-Z]/.test(v) && /[0-9!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(v), {
    message: "Include letters and at least one number or symbol.",
  });

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required.").max(120),
    email: z.string().email("Enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
