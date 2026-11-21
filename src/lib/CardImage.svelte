<script lang="ts">
	import cardBack from './assets/card-back.png';

	const CARD_SIZE_RATIO = 1024 / 1418;

	interface CardImageProps {
		class?: string;
		text: string;
		back?: boolean;
	}

	let props: CardImageProps = $props();
</script>

<div
	class="aspect-(--card-size-ratio) perspective-distant {props.class || ''}"
	style="--card-size-ratio: {CARD_SIZE_RATIO};"
>
	<div
		class="relative h-full w-full transition-transform duration-800 transform-3d {props.back
			? 'rotate-y-180'
			: ''}"
	>
		<div class="absolute h-full w-full backface-hidden">
			<div class="h-full w-full rounded-xl bg-amber-50">{props.text}</div>
		</div>
		<img
			alt="Card back"
			src={cardBack}
			class="absolute h-full w-full rotate-y-180 backface-hidden"
		/>
	</div>
</div>
