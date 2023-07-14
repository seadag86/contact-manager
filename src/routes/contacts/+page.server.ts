import { setError, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { createContactSchema, deleteContactSchema } from "$lib/schemas";
import { supabaseAdmin } from "$lib/server/supabase-admin";

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session) {
		throw redirect(303, "/login");
	}

	async function getContacts() {
		const { data: contacts, error: contactsError } = await event.locals.supabase
			.from("contacts")
			.select("*")
			.limit(10);

		if (contactsError) {
			throw error(500, "Error getting contacts");
		}

		return contacts;
	}

	return {
		createContactForm: await superValidate(event, createContactSchema, {
			id: "create"
		}),
		deleteContactForm: await superValidate(event, deleteContactSchema, {
			id: "delete"
		}),
		contacts: await getContacts()
	};
};

export const actions: Actions = {
	createContact: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, "Unauthorized");
		}

		const createContactForm = await superValidate(event, createContactSchema, {
			id: "create"
		});

		if (!createContactForm.valid) {
			return fail(400, { createContactForm });
		}

		const { error: createContactError } = await supabaseAdmin.from("contacts").insert({
			...createContactForm.data,
			user_id: session.user.id
		});

		if (createContactError) {
			console.log(error);
			return setError(createContactForm, null, "Error creating contact");
		}

		return {
			createContactForm
		};
	},
	deleteContact: async (event) => {
		const session = await event.locals.getSession();
		if (!session) {
			throw error(401, "Unauthorized");
		}

		const deleteContactForm = await superValidate(event.url, deleteContactSchema, {
			id: "delete"
		});

		if (!deleteContactForm.valid) {
			return fail(400, { deleteContactForm });
		}

		const { error: deleteContactError } = await supabaseAdmin
			.from("contacts")
			.delete()
			.eq("id", deleteContactForm.data.id);

		if (deleteContactError) {
			console.log(error);
			return setError(deleteContactForm, null, "Error deleting contact");
		}

		return {
			deleteContactForm
		};
	}
};
