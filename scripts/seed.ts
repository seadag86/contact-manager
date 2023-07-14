import { startSupabase, clearSupabaseData, createUser, createContact } from "./utils";

async function seed() {
	try {
		await startSupabase();
		await clearSupabaseData();
		const user = await createUser({
			email: "abc@noreply.com",
			full_name: "Test User",
			password: "password"
		});

		for (let i = 0; i < 5; i++) {
			await createContact(user.id);
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	process.exit();
}

seed();
