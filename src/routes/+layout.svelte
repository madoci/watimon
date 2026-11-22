<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { readDataFromStorage } from '#lib/storage-data.ts';

	let { children }: LayoutProps = $props();

	onMount(() => {
		// Update saved data when storage changes
		window.addEventListener('storage', readDataFromStorage);

		return () => {
			window.removeEventListener('storage', readDataFromStorage);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
