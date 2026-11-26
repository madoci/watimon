<script lang="ts">
    import type { Snippet } from 'svelte';
    import { onMount } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    export interface Offset {
        x: number;
        y: number;
    }

    export type SwipeEventType = 'mouse' | 'touch';

    type SwipeEvent = MouseEvent | Touch;

    interface SwiperProps extends HTMLButtonAttributes {
        touchDeadzone?: number;
        touchMinSpeed?: { x: number; y: number };
        children?: Snippet;
        onmove?: (offset: Offset, type: SwipeEventType) => void;
        onmoveend?: (offset: Offset, type: SwipeEventType) => void;
        onclick?: () => void;
    }

    const CLICK_OFFSET_TOLERANCE = 2;
    const CLICK_DURATION_TOLERANCE = 400;

    const STATUS = {
        IDLE: 0,
        STARTED: 1,
        DRAGGING: 2,
    };

    let {
        touchDeadzone,
        touchMinSpeed,
        children,
        onmove,
        onmoveend,
        onclick,
        ...props
    }: SwiperProps = $props();

    let status = $state(STATUS.IDLE);
    let startPosition = $state<Offset | null>(null);
    let startTimestamp = $state(Infinity);
    let startType = $state<SwipeEventType | null>(null);

    function getOffset(event: SwipeEvent, deadzone?: number) {
        const offset = {
            x: event.pageX - (startPosition?.x ?? 0),
            y: event.pageY - (startPosition?.y ?? 0),
        };
        return {
            x: Math.max(Math.abs(offset.x) - (deadzone ?? 0), 0) * (offset.x < 0 ? -1 : 1),
            y: Math.max(Math.abs(offset.y) - (deadzone ?? 0), 0) * (offset.y < 0 ? -1 : 1),
        };
    }

    function setStartPosition(event: SwipeEvent, type: SwipeEventType) {
        startPosition = null;
        startPosition = getOffset(event);
        startTimestamp = Date.now();
        startType = type;
    }

    function startMove(event: SwipeEvent, type: SwipeEventType) {
        if (!props.disabled && status === STATUS.IDLE) {
            status = STATUS.STARTED;
            setStartPosition(event, type);
        }
    }

    function stopMove(event: SwipeEvent, type: SwipeEventType, deadzone?: number) {
        if (status === STATUS.DRAGGING) {
            onmoveend?.(getOffset(event, deadzone), type);
        }
        status = STATUS.IDLE;
    }

    function move(event: SwipeEvent, type: SwipeEventType, deadzone?: number) {
        const offset = getOffset(event, deadzone);
        if (status === STATUS.STARTED && (offset.x || offset.y)) {
            const delay = (Date.now() - startTimestamp) / 1000;
            if (
                Math.abs(offset.x) / delay > (touchMinSpeed?.x ?? 0) ||
                Math.abs(offset.y) / delay > (touchMinSpeed?.y ?? 0)
            ) {
                status = STATUS.DRAGGING;
            }
            setStartPosition(event, type);
        }
        if (status === STATUS.DRAGGING) {
            onmove?.(getOffset(event), type);
        }
    }

    function handleMouseDown(e: MouseEvent) {
        startMove(e, 'mouse');
    }

    function handleMouseUp(e: MouseEvent) {
        stopMove(e, 'mouse');
    }

    function handleMouseMove(e: MouseEvent) {
        move(e, 'mouse');
    }

    function handleTouchStart(e: TouchEvent) {
        startMove(e.changedTouches[0], 'touch');
    }

    function handleTouchEnd(e: TouchEvent) {
        stopMove(e.changedTouches[0], 'touch', touchDeadzone ?? 10);
    }

    function handleTouchMove(e: TouchEvent) {
        move(e.changedTouches[0], 'touch', touchDeadzone ?? 10);
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
        stopMove(e, startType ?? 'mouse');
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
    data-dragging={status === STATUS.DRAGGING ? true : undefined}
    onmousedown={handleMouseDown}
    onmouseup={handleMouseUp}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
    onclick={handleClick}
>
    {@render children?.()}
</button>
