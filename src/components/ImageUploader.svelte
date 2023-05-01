<script lang="ts">
	import uploadImage from '$lib/assets/image.svg';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let dropZoneElement: HTMLDivElement;

	function handleClickSubmit() {
		dispatch('clickSubmit');
	}

	function handleDropSubmit(file: File) {
		dispatch('dropSubmit', { file });
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
			event.currentTarget.classList.remove('border-secondary-blue-100');
			if (file && file.type.includes('image')) {
				event.currentTarget.classList.add('border-green-500');
				event.currentTarget.classList.remove('border-red-500');
				// submit form with file
				handleDropSubmit(file);
			} else {
				event.currentTarget.classList.add('border-red-500');
				event.currentTarget.classList.remove('border-green-500');
			}
		}
	}

	function handleDragEnter(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		const data = event.dataTransfer;
		if (data && data.types.includes('Files')) {
			event.currentTarget.classList.add('border-2');
			event.currentTarget.classList.add('border-secondary-blue-100');
			event.currentTarget.classList.add('border-secondary-blue-100');
			event.currentTarget.classList.remove('border-red-500');
			event.currentTarget.classList.remove('border-green-500');
		}
	}

	function handleDragOver(
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		const data = event.dataTransfer;
		if (data) {
			if (data.types.includes('Files')) {
				data.dropEffect = 'copy';
				event.preventDefault();
			} else {
				data.dropEffect = 'none';
			}
		}
	}
</script>

<div class="h-[469px] w-[402px] space-y-6 rounded-xl bg-white px-8 py-[36px] shadow-default">
	<h1 class="text-center text-lg font-medium leading-[27px] text-primary-gray-400">
		Upload Your Image
	</h1>

	<p class="text-center text-[10px] font-medium leading-[15px] text-primary-gray-300">
		File should be Jpeg, Png,...
	</p>

	<div
		bind:this={dropZoneElement}
		on:drop|preventDefault={handleDragDrop}
		on:dragenter|preventDefault={handleDragEnter}
		on:dragover={handleDragOver}
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
