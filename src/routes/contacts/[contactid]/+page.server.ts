import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { setError, superValidate } from "sveltekit-superforms/server";
import { createContactSchema } from "$lib/schemas";

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		throw redirect(302, "/login");
	}

	async function getContact(id: string) {
		const { data: contact, error: contactError } = await event.locals.supabase
			.from("contacts")
			.select("*")
			.eq("id", id)
			.limit(1)
			.maybeSingle();

		if (contactError) {
			throw error(500, "Error getting contact");
		}

		if (!contact) {
			throw error(404, "Contact not found");
		}

		return contact;
	}

	return {
		updateContactForm: superValidate(await getContact(event.params.contactid), createContactSchema)
	};
};

export const actions: Actions = {
	updateContact: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, "Unauthorized");
		}

		const updateContactForm = await superValidate(event, createContactSchema);

		if (!updateContactForm.valid) {
			return fail(400, { updateContactForm });
		}

		const { error: contactError } = await event.locals.supabase
			.from("contacts")
			.update(updateContactForm.data)
			.eq("id", event.params.contactid);

		if (contactError) {
			return setError(updateContactForm, null, "Error updating contact");
		}

		return {
			updateContactForm
		};
	}
};
