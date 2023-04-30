<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
</script>

<main class="relative w-full h-screen bg-[#FAFAFB]">
	<div class="flex justify-center items-center px-4 h-full sm:px-0">
		<slot />
	</div>
	<Footer />
</main>
