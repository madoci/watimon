<script lang="ts">
    import type { TransitionConfig } from 'svelte/transition';
    import type { CardInfo } from './cards';
    import SwipeableCard from './SwipeableCard.svelte';

    export interface CardTransitionParameters {
        card: CardInfo;
        index: number;
        count: number;
    }

    interface CardPileProps {
        cards: CardInfo[];
        currentCard: CardInfo | undefined;
        cardInTransition?: (
            node: HTMLElement,
            params: CardTransitionParameters,
        ) => TransitionConfig;
        onswipe?: (nextCard: CardInfo | undefined) => void;
    }

    let { cards, currentCard, cardInTransition, onswipe }: CardPileProps = $props();

    let reversedCards = $derived([...cards].reverse());
    let currentIndex = $derived.by(() => {
        const index = reversedCards.findIndex((c) => c?.id === currentCard?.id);
        return index === -1 ? index : index;
    });

    function safeCardInTransition(node: HTMLElement, params: CardTransitionParameters) {
        return cardInTransition?.(node, params) ?? {};
    }

    function easeShadowOpacity(indexDelta: number) {
        return 1 - (Math.pow(indexDelta, 2) / 20 + indexDelta / 8);
    }

    let deadzone = $state('20');
    let speed = $state('200');
    let threshold = $state('250');

    function parseInput(value: string) {
        const num = Number(value);
        return Number.isNaN(num) ? undefined : num;
    }
</script>

<div class="relative h-full w-full select-none">
    {#each reversedCards as card, index (card?.id)}
        <div
            in:safeCardInTransition|global={{ card, index, count: reversedCards.length }}
            class="absolute top-1/2 left-0 w-full -translate-y-1/2"
        >
            <SwipeableCard
                {card}
                class="w-full"
                back={index < currentIndex}
                swiped={index > currentIndex}
                shadowOpacity={easeShadowOpacity(currentIndex - index)}
                onswipe={() => onswipe?.(reversedCards[currentIndex - 1])}
                deadzone={parseInput(deadzone)}
                speed={parseInput(speed)}
                threshold={parseInput(threshold)}
            />
        </div>
    {/each}
    <div class="absolute">
        <input bind:value={deadzone} />
        <input bind:value={speed} />
        <input bind:value={threshold} />
    </div>
</div>
