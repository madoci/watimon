<script lang="ts">
    import packImageTop from './assets/pack-top.png';
    import packImageBottom from './assets/pack-bottom.png';
    import { slideDown, thrown } from './pack-animations';
    import { fade } from 'svelte/transition';
    import PackSlicer from './PackSlicer.svelte';

    interface PackOpenerProps {
        onopen?: () => void;
    }

    let { onopen }: PackOpenerProps = $props();

    let openingDirection = $state(1);

    function handleOpen(direction: 1 | -1) {
        openingDirection = direction;
        onopen?.();
    }
</script>

<div class="perspective-dramatic">
    <img
        out:thrown|global={{ direction: openingDirection < 0 ? 'left' : 'right' }}
        alt="Card pack top"
        src={packImageTop}
        class="w-full transform-3d"
    />
    <div out:fade|global={{ duration: 200 }} class="h-0 w-full">
        <PackSlicer onopen={handleOpen} />
    </div>
    <img out:slideDown|global alt="Card pack bottom" src={packImageBottom} class="w-full" />
</div>
