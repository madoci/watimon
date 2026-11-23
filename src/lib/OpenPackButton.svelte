<script lang="ts">
    import type { Snippet } from 'svelte';
    import { getRemainingTime } from './packs';
    import { getTimeTick } from './time-tick.svelte';

    interface OpenPackButtonProps {
        renderOpenable: () => Snippet | string;
        renderUnopenable: (formattedDuration: string) => Snippet | string;
        onclick?: () => void;
    }

    const formatter = new Intl.DurationFormat('fr-FR', { style: 'digital', hours: '2-digit' });

    let { renderOpenable, renderUnopenable, onclick }: OpenPackButtonProps = $props();

    let value = $derived(getRemainingTime(getTimeTick()));
</script>

<button disabled={value >= 0} {onclick}>
    {value < 0 ? renderOpenable() : renderUnopenable(formatter.format({ seconds: value }))}
</button>
