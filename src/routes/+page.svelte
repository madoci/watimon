<script lang="ts">
	import PackCard from '#lib/PackCard.svelte';

	const cards = ['A', 'B', 'C', 'D'];

	let index = $state(0);

	let reverseIndex = $derived(cards.length - 1 - index);
	let sortedCards = $derived([...cards].reverse());
</script>

<h1>Watimon</h1>
<button onclick={() => (index = 0)}>Reset</button>
<div class="flex w-full justify-center">
	<div class="relative h-[400px] w-[250px] select-none">
		{#each sortedCards as card, i (card)}
			<PackCard
				class="absolute top-0 left-0 w-full"
				text={card}
				back={i < reverseIndex}
				swiped={i > reverseIndex}
				onswipe={() => index++}
			/>
		{/each}
	</div>
</div>
