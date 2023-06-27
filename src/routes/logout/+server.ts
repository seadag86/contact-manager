import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	const { error: authError } = await event.locals.supabase.auth.signOut();

	if (authError) {
		throw error(500, "Error logging out. Please try again.");
	}

	throw redirect(302, "/login");
};
