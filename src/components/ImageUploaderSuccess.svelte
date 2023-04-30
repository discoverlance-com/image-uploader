<script lang="ts">
	export let imageUrl: string;

	function truncate(str: string, maxlength: number) {
		return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str;
	}

	let truncatedImageUrl = truncate(imageUrl, 50);
	let copyText = 'Copy File';

	let timeout: NodeJS.Timeout;

	function copyToClipboard() {
		navigator.clipboard
			.writeText(imageUrl)
			.then(() => {
				clearTimeout(timeout);
				copyText = 'Copied!';
				timeout = setTimeout(() => {
					copyText = 'Copy File';
				}, 2000);
			})
			.catch((reason) => {
				console.log('Copying failed: ', reason);
				window.prompt('Please copy url: ', imageUrl);
			});
	}
</script>

<div class="bg-white rounded-xl w-[402px] h-[469px] px-8 py-[36px] shadow-default">
	<div class="mb-3 text-center">
		<span class="material-icons success md-35">check_circle</span>
	</div>
	<h1 class="font-medium text-lg leading-[27px] text-center text-primary-gray-400 mb-6">
		Uploaded Successfully!
	</h1>

	<div class="h-[218.9px] mb-6">
		<img src={imageUrl} alt="Uploaded File" class="object-center w-[338px] h-full rounded-xl" />
	</div>

	<div
		class="rounded-lg border-[#E0E0E0] border bg-primary-gray-50 pl-2 pr-[2px] flex gap-[15px] items-center h-[34px] w-[338px]"
	>
		<p class="flex-1 py-3 text-xs text-primary-gray-400">
			{truncatedImageUrl}
		</p>

		<button
			on:click={copyToClipboard}
			class="bg-secondary-blue-200 cursor-pointer text-white h-[calc(34px-4px)] w-[101px] rounded-lg text-[12px] flex items-center justify-center hover:bg-secondary-blue-200/90"
		>
			<span>{copyText}</span>
		</button>
	</div>
</div>

<style>
	.material-icons.success {
		color: #219653;
	}
	.material-icons.md-35 {
		font-size: 35px;
	}
</style>
