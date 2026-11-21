<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CardImage from './CardImage.svelte';
	import Swiper from './Swiper.svelte';
	import type { Offset } from './Swiper.svelte';
	import classnames from './classnames';

	interface PackCardProps extends ComponentProps<typeof CardImage> {
		class?: string;
		swiped?: boolean;
		disabled?: boolean;
		onswipe?: () => void;
	}

	const SWIPE_THRESHOLD = 50;
	const COMMON_STYLE = 'translate-x-(--pack-card-translation) rotate-(--pack-card-rotation)';
	const BASE_STYLE = 'transition-transform';
	const HIDDEN_STYLE =
		'translate-y-[5%] opacity-0 [--pack-card-duration:300ms] [--pack-card-opacity-delay:150ms] transition-[transform,translate,rotate,opacity] duration-[var(--pack-card-duration),var(--pack-card-duration),var(--pack-card-duration),calc(var(--pack-card-duration)-var(--pack-card-opacity-delay))] delay-[0ms,0ms,0ms,var(--pack-card-opacity-delay)] ease-linear';

	let { class: classProp, swiped, disabled, onswipe, ...props }: PackCardProps = $props();

	let offset = $state(0);
	let swipedDirection = $state(0);
	let hidden = $state(false);

	let resolvedSwipedDirection = $derived(swiped !== false ? swipedDirection : 0);

	let translation = $derived(
		resolvedSwipedDirection ? `${resolvedSwipedDirection * 200}%` : `${offset}px`,
	);
	let rotation = $derived(resolvedSwipedDirection ? `${resolvedSwipedDirection * 5}deg` : '0deg');

	function swipe(direction: number) {
		hidden = false;
		swipedDirection = direction;
		onswipe?.();
	}

	function handleMove({ x }: Offset) {
		offset = x;
	}

	function handleMoveEnd({ x }: Offset) {
		offset = 0;
		if (Math.abs(x) > SWIPE_THRESHOLD) {
			swipe(x < 0 ? -1 : 1);
		}
	}

	function handleClick() {
		offset = 0;
		if (!resolvedSwipedDirection) {
			swipe(1);
		}
	}

	function handleTransitionEnd() {
		if (resolvedSwipedDirection) {
			hidden = true;
		}
	}
</script>

<Swiper
	class={classnames(
		classProp,
		COMMON_STYLE,
		resolvedSwipedDirection ? HIDDEN_STYLE : BASE_STYLE,
		props.back && 'border border-transparent',
		!!resolvedSwipedDirection && hidden && 'hidden',
	)}
	style="--pack-card-translation: {translation}; --pack-card-rotation: {rotation};"
	disabled={disabled || !!resolvedSwipedDirection}
	aria-hidden={!!resolvedSwipedDirection}
	onmove={handleMove}
	onmoveend={handleMoveEnd}
	onclick={handleClick}
	ontransitionend={handleTransitionEnd}
>
	<CardImage {...props} class="w-full" />
</Swiper>
