<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import CardPile from './CardPile.svelte';
    import type { CardInfo } from './cards';
    import { slideCardUp } from './pack-animations';

    interface PackCardPileProps {
        cards: ComponentProps<typeof CardPile>['cards'];
    }

    let { cards }: PackCardPileProps = $props();

    let currentCard = $state<CardInfo | undefined>(undefined);
</script>

<div class="h-full w-full p-2">
    <CardPile
        {cards}
        currentCard={currentCard ?? cards[0]}
        cardInTransition={slideCardUp}
        onswipe={(card) => (currentCard = card)}
    />
</div>
