import { z } from "zod";
import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { AuthApiError } from "@supabase/supabase-js";

const registerUserSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 6 characters")
});

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	if (session) {
		throw redirect(303, "/");
	}

	return {
		form: await superValidate(event, registerUserSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, registerUserSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: authError } = await event.locals.supabase.auth.signInWithPassword(form.data);

		if (authError) {
			if (authError instanceof AuthApiError && authError.status === 400) {
				setError(form, "email", "Invalid credentials");
				setError(form, "password", "Invalid credentials");
				return fail(400, {
					form
				});
			}
		}

		throw redirect(303, "/");
	}
};
