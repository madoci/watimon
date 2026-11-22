<script lang="ts">
	import packImage from './assets/pack.png';
	import packImageTop from './assets/pack-top.png';
	import packImageBottom from './assets/pack-bottom.png';
	import classnames from './utils/classnames';
	import { crossfade, slideDown, thrown, whirl } from './card-pack-animations';
	import { fade } from 'svelte/transition';
	import CardPackOpener from './CardPackOpener.svelte';

	const PACK_SIZE_RATIO = 400 / 731;

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

	function handleOpen() {
		if (status === PACK_STATUS.OPENING) {
			status = PACK_STATUS.OPENED;
		}
	}
</script>

<div class="center flex h-full w-full p-8 perspective-distant">
	<div
		in:whirl
		class={classnames(
			'relative m-auto aspect-(--pack-size-ratio) w-full transform-3d',
			status === PACK_STATUS.OPENING && 'translate-y-[80%] transition-transform duration-1000',
			status === PACK_STATUS.OPENED && 'translate-y-[80%] transition-transform duration-1000',
			status === PACK_STATUS.OPENED &&
				false &&
				'translate-y-[120%] transition-transform delay-500 duration-1000',
		)}
		style="--pack-size-ratio: {PACK_SIZE_RATIO};"
	>
		{#if status === PACK_STATUS.IDLE}
			<button
				out:crossfade={{ delayed: true }}
				class="h-full w-full {status !== PACK_STATUS.IDLE ? 'absolute top-0 left-0' : ''}"
				disabled={status !== PACK_STATUS.IDLE}
				onclick={() => (status = PACK_STATUS.OPENING)}
			>
				<img alt="Card pack" src={packImage} class="h-full w-full" />
			</button>
		{:else if status === PACK_STATUS.OPENING}
			<div in:crossfade class="perspective-dramatic">
				<img
					out:thrown
					alt="Card pack top"
					src={packImageTop}
					class="w-full origin-bottom-right transform-3d"
				/>
				<div out:fade={{ duration: 200 }} class="h-0 w-full">
					<CardPackOpener onopen={handleOpen} />
				</div>
				<img out:slideDown alt="Card pack bottom" src={packImageBottom} class="w-full" />
			</div>
		{/if}
	</div>
</div>
