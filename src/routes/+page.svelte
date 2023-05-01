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

	async function handleDropSubmit(file: File) {
		await handleSubmit(file);
	}

	async function handleDragDrop(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		const data = event.dataTransfer;
		const files = data?.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file && file.type.includes('image')) {
				data.dropEffect = 'copy';
				event.currentTarget.classList.add('border-green-500');
				event.currentTarget.classList.remove('border-red-500');
				// submit form with file
				await handleDropSubmit(file);
			} else {
				data.dropEffect = 'none';
				event.currentTarget.classList.add('border-red-500');
				event.currentTarget.classList.remove('border-green-500');
			}
		}
	}

	function handleDragOver(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		//
	}

	function handleDragEnter(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		const data = event.dataTransfer;
		if (data && data.types.includes('Files')) {
			event.currentTarget.classList.add('border-2');
		}
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
					class="h-[469px] w-[402px] space-y-6 rounded-xl bg-white px-8 py-[36px] shadow-default"
				>
					<h1 class="text-center text-lg font-medium leading-[27px] text-primary-gray-400">
						Upload Your Image
					</h1>

					<p class="text-center text-[10px] font-medium leading-[15px] text-primary-gray-300">
						File should be Jpeg, Png,...
					</p>

					<div
						bind:this={dropZoneElement}
						on:drop|preventDefault|stopPropagation={handleDragDrop}
						on:dragover|preventDefault={handleDragOver}
						on:dragenter|preventDefault={handleDragEnter}
						class="h-[218.9px] rounded-xl border border-dashed border-secondary-blue-100 bg-primary-gray-50"
					>
						<div class="flex justify-center items-center mt-9">
							<img src={uploadImage} alt="Upload File" />
						</div>
						<p class="mt-9 text-center text-xs leading-[18px] text-primary-gray-100">
							Dray & Drop your image here
						</p>
					</div>

					<p class="text-center text-xs leading-[18px] text-primary-gray-100">Or</p>

					<div class="flex justify-center">
						<label
							for="upload-file"
							class="flex h-8 w-[101px] cursor-pointer items-center justify-center rounded-lg bg-secondary-blue-200 text-[12px] text-white hover:bg-secondary-blue-200/90"
						>
							<input
								name="file"
								type="file"
								class="hidden"
								id="upload-file"
								accept="image/*"
								on:change={handleClickSubmit}
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
