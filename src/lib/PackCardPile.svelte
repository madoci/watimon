<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import CardPile from './CardPile.svelte';
    import type { CardInfo } from './cards';
    import { slideCardUp } from './pack-animations';

    interface PackCardPileProps {
        cards: ComponentProps<typeof CardPile>['cards'];
        onemptied?: () => void;
    }

    let { cards, onemptied }: PackCardPileProps = $props();

    let currentCard = $state<CardInfo | undefined | 'init'>('init');

    function handleSwipe(card: CardInfo | undefined) {
        currentCard = card;
        if (!card) {
            // Wait for last card animation to finish before calling onemptied
            setTimeout(() => {
                onemptied?.();
            }, 1000);
        }
    }
</script>

<div class="h-full w-full p-2">
    <CardPile
        {cards}
        currentCard={currentCard === 'init' ? cards[0] : currentCard}
        cardInTransition={slideCardUp}
        onswipe={handleSwipe}
    />
</div>
