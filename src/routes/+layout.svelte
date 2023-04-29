<script>
    import "../app.css"
	import Footer from "../components/Footer.svelte";
</script>

<main class="relative w-full h-screen bg-[#FAFAFB]">
    <div class="flex items-center justify-center h-full px-4 sm:px-0">
        <slot />
    </div>
    <Footer />
</main>