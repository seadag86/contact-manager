<script lang="ts">
	import { EnvelopeIcon } from "$lib/components/icons";
	import { Button } from "flowbite-svelte";
	import type { Validation } from "sveltekit-superforms/index";
	import type { EmailSchema } from "$lib/schemas";

	import { superForm } from "sveltekit-superforms/client";

	export let data: Validation<EmailSchema>;

	const { form, errors, enhance } = superForm(data);
</script>

<section class="px-6 pt-16">
	<div class="flex items-center font-semibold">
		<EnvelopeIcon />
		<span class="ml-4">Email Address</span>
	</div>
	<p class="mt-3 max-w-none text-sm">Change the email associated with your account</p>
	<!-- Email Address Form -->
	<form method="POST" action="?/updateEmail" use:enhance class="mt-8">
		<label for="email" class="space-y-2">
			<span>Email</span>
			<input type="email" name="email" bind:value={$form.email} />
			{#if $errors.email}
				<div class="block text-red-600 dark:text-red-500">{$errors.email}</div>
			{/if}
		</label>
		<Button type="submit" class="mt-4">Update Email</Button>
	</form>
</section>
