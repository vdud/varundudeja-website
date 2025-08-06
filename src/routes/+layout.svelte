<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import logo from '$lib/assets/logo.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppBar
	classes="sticky top-0"
	headlineClasses="flex sm:hidden"
	centerClasses="flex hidden sm:block"
>
	{#snippet lead()}
		<!-- Logo container -->
		<div class="flex items-center space-x-4">
			<img src={logo} class="w-36" alt="Logo" />
		</div>
	{/snippet}

	{#snippet trail()}
		<!-- Buttons container -->
		<div class="hidden items-center space-x-4 sm:flex">
			<appkit-button></appkit-button>
			<appkit-network-button></appkit-network-button>
		</div>
		<div class="block sm:hidden">
			<!-- Mobile menu icon could go here -->
		</div>
	{/snippet}
</AppBar>

{@render children?.()}
