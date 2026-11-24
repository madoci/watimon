<script lang="ts">
    import { onMount } from 'svelte';
    import { getRemainingTime } from './packs';
    import { getTimeTick } from './time-tick.svelte';

    interface OpenPackButtonProps {
        renderOpenable: () => string;
        renderUnopenable: (formattedDuration: string) => string;
        onclick?: () => void;
    }

    const formatter = new Intl.DurationFormat('fr-FR', { style: 'digital', hours: '2-digit' });

    let { renderOpenable, renderUnopenable, onclick }: OpenPackButtonProps = $props();

    let isLoaded = $state(false);
    let value = $derived(getRemainingTime(getTimeTick()));

    // Svelte build an initial HTML file with some mocked values.
    // In this case, we don't want it to choose the openable not the unopenable text at launch.
    // This code makes Svelte build an HTML file with another content that will be replaced immediatly.
    onMount(() => {
        isLoaded = true;
    });
</script>

{#if isLoaded}
    <button
        class="w-full cursor-pointer rounded-full border-4 border-white bg-linear-120 from-blue-400 via-cyan-300 to-blue-400 bg-size-[400%_100%] p-4 text-xl font-bold text-white shadow-md select-none text-shadow-md disabled:cursor-default motion-safe:animate-gradient-pan-loop"
        disabled={value >= 0}
        {onclick}
    >
        {value >= 0 ? renderUnopenable(formatter.format({ seconds: value })) : renderOpenable()}
    </button>
{:else}
    <span></span>
{/if}
