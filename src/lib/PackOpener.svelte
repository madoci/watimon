<script lang="ts">
    import Swiper, { type Offset } from './Swiper.svelte';

    interface PackOpenerProps {
        onopen?: () => void;
    }

    let { onopen }: PackOpenerProps = $props();

    let offsetWidth = $state<number>(Infinity);

    function handleMove({ x }: Offset) {
        if (x / offsetWidth > 0.5) {
            onopen?.();
        }
    }

    function handleClick() {
        onopen?.();
    }
</script>

<div
    bind:offsetWidth
    class="relative h-3 w-full -translate-y-1/2 items-center border-y-4 border-solid border-transparent bg-linear-to-r from-blue-500 via-cyan-300 to-blue-500 bg-size-[200%_100%] [border-image:linear-gradient(to_right,#ffffff,#ffffff_75%,#aaaaaa)_1] motion-safe:animate-gradient-pan"
>
    <Swiper
        class="absolute top-1/2 left-1/2 h-10 w-[110%] -translate-1/2 rounded-full"
        onmove={handleMove}
        onclick={handleClick}
    >
        <div></div>
    </Swiper>
</div>
