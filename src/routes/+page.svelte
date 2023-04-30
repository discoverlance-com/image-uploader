<script lang="ts">
	import ImageUploader from '../components/ImageUploader.svelte';
	import ImageUploaderLoading from '../components/ImageUploaderLoading.svelte';
	import ImageUploaderSuccess from '../components/ImageUploaderSuccess.svelte';
	import uploadImage from '$lib/assets/image.svg';

	import { fly } from 'svelte/transition';
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

	export let form: ActionData;

	async function handleSubmit() {
		const data = new FormData(submitForm);
		uploading = true;

		const response = await fetch($page.url.href, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result: ActionResult = deserialize(await response.text());
		console.log({ result });

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			await invalidateAll();
		}
		uploading = false;
		imageUrl = result.data.image_url;
		applyAction(result);
	}

	function handleFileChange() {
		submitForm.submit();
	}
</script>

<svelte:head>
	<title>My Devchallenge - Image Uploader</title>
</svelte:head>

<div>
	{#if form?.error}
		<div
			class="p-2 mb-4 text-sm text-white rounded-lg bg-secondary-blue-100"
			role="alert"
			transition:fly={{ y: -100, duration: 1000 }}
		>
			<p>{form?.message}</p>
		</div>
	{/if}
	<form method="POST" enctype="multipart/form-data" class="space-y-6" bind:this={submitForm}>
		{#if uploading && !imageUrl}
			<div transition:fly={{ y: -200, duration: 1000 }}>
				<ImageUploaderLoading />
			</div>
		{/if}
		{#if !imageUrl && !uploading}
			<div transition:fly={{ y: -200, duration: 500 }}>
				<div
					class="bg-white rounded-xl w-[402px] h-[469px] px-8 py-[36px] space-y-6 shadow-default"
				>
					<h1 class="font-medium text-lg leading-[27px] text-center text-primary-gray-400">
						Upload Your Image
					</h1>

					<p class="text-[10px] font-medium leading-[15px] text-primary-gray-300 text-center">
						File should be Jpeg, Png,...
					</p>

					<div
						class="h-[218.9px] bg-primary-gray-50 rounded-xl border-secondary-blue-100 border border-dashed"
					>
						<div class="flex justify-center items-center mt-9">
							<img src={uploadImage} alt="Upload File" />
						</div>
						<p class="text-center text-primary-gray-100 text-xs leading-[18px] mt-9">
							Dray & Drop your image here
						</p>
					</div>

					<p class="text-center text-primary-gray-100 text-xs leading-[18px]">Or</p>

					<div class="flex justify-center">
						<label
							for="upload-file"
							class="bg-secondary-blue-200 cursor-pointer text-white h-8 w-[101px] rounded-lg text-[12px] flex items-center justify-center hover:bg-secondary-blue-200/90"
						>
							<input
								name="file"
								type="file"
								class="hidden"
								id="upload-file"
								accept="image/*"
								on:change={handleSubmit}
							/>
							<span class="font-medium font-noto-sans">Choose a file</span>
						</label>
					</div>
				</div>
			</div>
		{/if}
	</form>
	{#if imageUrl}
		<div transition:fly={{ y: -200, duration: 2000 }}>
			<ImageUploaderSuccess {imageUrl} />
		</div>
	{/if}
</div>
