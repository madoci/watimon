<script lang="ts">
    import Swiper, { type Offset } from './Swiper.svelte';

    interface PackSlicerProps {
        onopen?: (direction: 1 | -1) => void;
    }

    let { onopen }: PackSlicerProps = $props();

    let offsetWidth = $state<number>(Infinity);

    function handleMove({ x }: Offset) {
        if (Math.abs(x) / offsetWidth > 0.5) {
            onopen?.(x < 0 ? -1 : 1);
        }
    }

    function handleClick() {
        onopen?.(1);
    }
</script>

<div
    bind:offsetWidth
    class="relative w-full -translate-y-1/2 bg-linear-[to_right,var(--color-blue-100),var(--color-blue-50)_25%,var(--color-blue-100)_75%,var(--color-slate-300)] py-1"
>
    <div
        class="gradient-animation h-1 w-full bg-linear-to-r from-blue-500 via-cyan-300 to-blue-500 bg-size-[200%_100%]"
    ></div>
    <Swiper
        class="absolute top-1/2 left-1/2 h-10 w-[110%] -translate-1/2 rounded-full"
        onmove={handleMove}
        onclick={handleClick}
    ></Swiper>
</div>

<style>
    .gradient-animation {
        animation: gradient-pan 3s linear infinite;
    }

    @keyframes gradient-pan {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
</style>
