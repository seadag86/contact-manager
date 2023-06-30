import { startSupabase, clearSupabaseData, createUser } from "./utils";

async function seed() {
	try {
		await startSupabase();
		await clearSupabaseData();
		await createUser({
			email: "abc@noreply.com",
			full_name: "Test User",
			password: "password"
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}

	process.exit();
}

seed();
