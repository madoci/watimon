<script lang="ts">
	import { fade } from 'svelte/transition';
	import packImage from './assets/pack.png';
	import Swiper, { type Offset } from './Swiper.svelte';
	import { sinusoidal } from './utils/animations';
	import classnames from './utils/classnames';

	const PACK_SIZE_RATIO = 400 / 731;
	const MAX_SCALE = 1.2;

	const PACK_STATUS = {
		IDLE: 0,
		OPENING: 1,
		OPENED: 2,
	};

	interface CardPackProps {
		onopened?: () => void;
	}

	let { onopened }: CardPackProps = $props();

	let status = $state(PACK_STATUS.IDLE);
	let offset = $state(0);
	let offsetWidth = $state<number>(Infinity);

	function whirlIn(node: HTMLElement) {
		return {
			duration: 1500,
			css: (t: number) => {
				const translationX =
					t < 1 / 3
						? sinusoidal(t, 1.5, -1, 1)
						: t > 2 / 3
							? sinusoidal(t, 1.5, -1, -1)
							: sinusoidal(t, 1.5, -1, 0);
				const translationY = sinusoidal(t, 1, -1, 1);
				const rotationY =
					t < 0.5 ? sinusoidal(t, 1, 1, 1) : sinusoidal(2 * (t - 0.5), 1, 1, -1) * 0.2;
				const scale =
					t < 0.5
						? sinusoidal(t, 1, -1, 1) * MAX_SCALE
						: sinusoidal(t, 1, -1, 1) * (MAX_SCALE - 1) + 1;
				return `transform: scale(${scale}) translateX(${translationX * 75}%) translateY(${translationY * 10}%) rotateY(${rotationY * 180}deg)`;
			},
		};
	}

	function slideOut(node: HTMLElement) {
		return {
			duration: 500,
			css: (t: number) => {
				return `transform: translateY(${(1 - t) * 200}%)`;
			},
		};
	}

	function handleMove({ x }: Offset) {
		if (status !== PACK_STATUS.OPENING) {
			return;
		}

		const maxWidth = offsetWidth - 24;
		offset = Math.min(Math.max(x, 0), maxWidth);
		if ((maxWidth - offset) / maxWidth < 0.2) {
			offset = maxWidth;
			status = PACK_STATUS.OPENED;
		}
	}

	function handleMoveEnd({ x }: Offset) {
		if (status !== PACK_STATUS.OPENING) {
			return;
		}

		offset = 0;
		/*if (Math.abs(x) > SWIPE_THRESHOLD) {
			swipe(x < 0 ? -1 : 1);
		}*/
	}

	function handleClick() {
		/*offset = 0;
		if (!resolvedSwipedDirection) {
			swipe(1);
		}*/
	}
</script>

<div class="center flex h-full w-full p-8 perspective-distant">
	<div
		in:whirlIn
		class={classnames(
			'relative m-auto aspect-(--pack-size-ratio) w-full transform-3d',
			status === PACK_STATUS.OPENING && 'translate-y-[80%] transition-transform duration-1000',
			status === PACK_STATUS.OPENED &&
				'translate-y-[120%] transition-transform delay-500 duration-1000',
		)}
		style="--pack-size-ratio: {PACK_SIZE_RATIO};"
	>
		<button
			class="h-full w-full"
			disabled={status !== PACK_STATUS.IDLE}
			onclick={() => (status = PACK_STATUS.OPENING)}
		>
			<img alt="Card pack" src={packImage} class="h-full w-full" />
		</button>
		{#if status === PACK_STATUS.OPENING}
			<div
				bind:offsetWidth
				transition:fade
				class="absolute top-[5%] left-0 flex h-1 w-full items-center bg-amber-300"
			>
				<Swiper
					class="h-7 w-12 translate-x-(--pack-opener-translation) rounded-full bg-amber-600"
					style="--pack-opener-translation: calc({offset}px - 25%);"
					onmove={handleMove}
					onmoveend={handleMoveEnd}
				></Swiper>
			</div>
		{/if}
	</div>
</div>
