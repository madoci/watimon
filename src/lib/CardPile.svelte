<script lang="ts">
	import SwipeableCard from './SwipeableCard.svelte';

	interface CardPileProps {
		cards: number[];
		currentCard: number | undefined;
		onswipe?: (nextCard: number | undefined) => void;
	}

	let { cards, currentCard, onswipe }: CardPileProps = $props();

	let reversedCards = $derived([...cards].reverse());
	let currentIndex = $derived.by(() => {
		const index = reversedCards.findIndex((c) => c === currentCard);
		return index === -1 ? index : index;
	});
</script>

<div class="relative h-[400px] w-[250px] select-none">
	{#each reversedCards as card, index (card)}
		<SwipeableCard
			{card}
			class="absolute top-0 left-0 w-full"
			back={index < currentIndex}
			swiped={index > currentIndex}
			onswipe={() => onswipe?.(reversedCards[currentIndex - 1])}
		/>
	{/each}
</div>
