<script lang="ts">
    import cardBackImage from './assets/card-back.png';
    import type { CardInfo } from './cards';

    const CARD_SIZE_RATIO = 1024 / 1418;

    interface CardImageProps {
        card: CardInfo;
        class?: string;
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
        {#await import(`./assets/cards-front/card-${1}.png`) then { default: cardFrontImage }}
            <img
                alt="Card front"
                src={cardFrontImage}
                class="absolute h-full w-full backface-hidden"
                draggable="false"
            />
        {/await}
        <img
            alt="Card back"
            src={cardBackImage}
            class="absolute h-full w-full rotate-y-180 backface-hidden"
            draggable="false"
        />
    </div>
</div>
