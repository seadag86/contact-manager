import { z } from "zod";

export const registerUserSchema = z.object({
	full_name: z.string().max(140, "Name must be 140 characters or less").nullish(),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(64, "Password must be 64 characters or less"),
	passwordConfirm: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(64, "Password must be 64 characters or less")
});

export const profileSchema = registerUserSchema.pick({ full_name: true });
export type ProfileSchema = typeof profileSchema;

export const emailSchema = registerUserSchema.pick({ email: true });
export type EmailSchema = typeof emailSchema;

export const passwordSchema = registerUserSchema.pick({ password: true, passwordConfirm: true });
export type PasswordSchema = typeof passwordSchema;

export const createContactSchema = z
	.object({
		name: z.string().max(140, "Name must be 140 characters or less").nullish(),
		email: z.string().email("Invalid email address").nullish(),
		company: z.string().max(140, "Company must be 140 characters or less").nullish(),
		phone: z.string().max(64, "Phone must be 64 characters or less").nullish()
	})
	.refine(({ name, email, company, phone }) => {
		return name || email || company || phone;
	}, "At least one field must be filled");

export type CreateContactSchema = typeof createContactSchema;

export const deleteContactSchema = z.object({
	id: z.string()
});

export type DeleteContactSchema = typeof deleteContactSchema;
