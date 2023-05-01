<script lang="ts">
	import ImageUploader from '../components/ImageUploader.svelte';
	import ImageUploaderLoading from '../components/ImageUploaderLoading.svelte';
	import ImageUploaderSuccess from '../components/ImageUploaderSuccess.svelte';

	import { slide } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import type { ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';
	import { page } from '$app/stores';

	// indicate that the file is being uploaded
	let uploading = false;
	// image to be displayed to the user
	let imageUrl = '';
	let submitForm: HTMLFormElement;
	let dropZoneElement: HTMLDivElement;

	export let form: ActionData;

	async function handleSubmit(file?: File | undefined) {
		let data: FormData;
		if (file) {
			data = new FormData();
			data.append('file', file);
		} else {
			data = new FormData(submitForm);
		}
		uploading = true;

		const response = await fetch($page.url.href, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			await invalidateAll();
		}
		uploading = false;
		imageUrl = result.data.image_url;
		applyAction(result);
	}

	async function handleClickSubmit() {
		await handleSubmit();
	}

	async function handleDropSubmit(event: any) {
		await handleSubmit(event.detail.file);
	}
</script>

<svelte:head>
	<title>My Devchallenge - Image Uploader</title>
	<meta name="description" content="Upload any image and get a url to access it." />
	<meta property="og:title" content="My Devchallenge - Image Uploader" />
	<meta property="og:site_name" content="Image Uploader" />
	<meta property="og:url" content="https://my-devchallenge-image-uploader.netlify.app" />
	<meta property="og:description" content="Upload any image and get a url to access it." />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://my-devchallenge-image-uploader.netlify.app/image.svg"
	/>
</svelte:head>

<div>
	{#if form?.error}
		<div
			class="mb-4 rounded-lg bg-secondary-blue-100 p-2 text-sm text-white"
			role="alert"
			transition:slide|local
		>
			<p>{form?.message}</p>
		</div>
	{/if}
	<form method="POST" enctype="multipart/form-data" class="space-y-6" bind:this={submitForm}>
		{#if uploading && !imageUrl}
			<div transition:slide|local>
				<ImageUploaderLoading />
			</div>
		{/if}
		{#if !imageUrl && !uploading}
			<div transition:slide|local>
				<ImageUploader
					{dropZoneElement}
					on:clickSubmit={handleClickSubmit}
					on:dropSubmit={handleDropSubmit}
				/>
			</div>
		{/if}
	</form>
	{#if imageUrl}
		<div transition:slide|local>
			<ImageUploaderSuccess {imageUrl} />
		</div>
	{/if}
</div>
