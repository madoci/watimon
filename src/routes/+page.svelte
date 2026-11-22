<script lang="ts">
	import CardPile from '#lib/CardPile.svelte';
	import CardPack from '#lib/CardPack.svelte';

	const cards = [1, 2, 3, 4, 5];

	let currentCard = $state<number | undefined>(cards[0]);
	let packShown = $state(false);
</script>

<div class="h-full w-full">
	<div class="m-auto h-full w-full max-w-md">
		{#if packShown}
			<CardPack onopened={() => (packShown = false)} />
		{:else}
			<button onclick={() => (packShown = true)}>Open pack</button>
		{/if}
	</div>
</div>
{#if false}
	<div class="flex w-full justify-center">
		<CardPile {cards} {currentCard} onswipe={(card) => (currentCard = card)} />
	</div>
{/if}
