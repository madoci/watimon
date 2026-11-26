<script lang="ts">
    import './layout.css';
    import favicon from '#lib/assets/local/favicon.svg';
    import type { LayoutProps } from './$types';
    import { onMount } from 'svelte';
    import { readDataFromStorage } from '#lib/storage-data.ts';
    import { initializeTimeTick } from '#lib/time-tick.svelte.ts';

    let { children }: LayoutProps = $props();

    onMount(() => {
        // Intialize time tick shared state
        const cleanupTimeTick = initializeTimeTick();

        // Update saved data when storage changes
        window.addEventListener('storage', readDataFromStorage);

        return () => {
            cleanupTimeTick();
            window.removeEventListener('storage', readDataFromStorage);
        };
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
