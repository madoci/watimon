<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface Offset {
		x: number;
		y: number;
	}

	interface SwiperProps extends HTMLButtonAttributes {
		children?: Snippet;
		onmove?: (offset: Offset) => void;
		onmoveend?: (offset: Offset) => void;
		onclick?: () => void;
	}

	type SwipeEvent = MouseEvent | Touch;

	const CLICK_OFFSET_TOLERANCE = 2;
	const CLICK_DURATION_TOLERANCE = 400;

	let { children, onmove, onmoveend, onclick, ...props }: SwiperProps = $props();

	let isDragging = $state(false);
	let startPosition = $state<Offset | null>(null);
	let startTimestamp = $state(Infinity);

	function getOffset(event: SwipeEvent, ignoreStart?: boolean) {
		const start = ignoreStart ? null : startPosition;
		return {
			x: event.pageX - (start?.x ?? 0),
			y: event.pageY - (start?.y ?? 0),
		};
	}

	function startMove(event: SwipeEvent) {
		if (!props.disabled && !isDragging) {
			isDragging = true;
			startPosition = getOffset(event, true);
			startTimestamp = Date.now();
		}
	}

	function stopMove(event: SwipeEvent) {
		if (isDragging) {
			isDragging = false;
			onmoveend?.(getOffset(event));
		}
	}

	function move(event: SwipeEvent) {
		if (isDragging) {
			onmove?.(getOffset(event));
		}
	}

	function handleMouseDown(e: MouseEvent) {
		startMove(e);
	}

	function handleMouseUp(e: MouseEvent) {
		stopMove(e);
	}

	function handleMouseMove(e: MouseEvent) {
		move(e);
	}

	function handleTouchStart(e: TouchEvent) {
		startMove(e.changedTouches[0]);
	}

	function handleTouchEnd(e: TouchEvent) {
		stopMove(e.changedTouches[0]);
	}

	function handleTouchMove(e: TouchEvent) {
		move(e.changedTouches[0]);
	}

	function handleClick(e: MouseEvent) {
		const offset = getOffset(e);
		if (
			Math.abs(offset.x) < CLICK_OFFSET_TOLERANCE &&
			Math.abs(offset.y) < CLICK_OFFSET_TOLERANCE &&
			Date.now() - startTimestamp < CLICK_DURATION_TOLERANCE
		) {
			onclick?.();
		}
		startTimestamp = Infinity;
	}

	function handlePointerUp(e: PointerEvent) {
		stopMove(e);
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchEnd);
		// Some 'mouseup' event aren't triggered, but 'pointerup' seems to work
		window.addEventListener('pointerup', handlePointerUp);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);
			window.removeEventListener('pointerup', handlePointerUp);
		};
	});
</script>

<button
	{...props}
	class="{props.class || ''} data-dragging:transition-none"
	data-dragging={isDragging ? true : undefined}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	onclick={handleClick}
>
	{@render children?.()}
</button>
