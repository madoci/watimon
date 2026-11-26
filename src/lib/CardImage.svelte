<script lang="ts">
    import { HoverTilt } from 'hover-tilt';
    import cardBackImage from './assets/card-back_scaled.png';
    import type { CardInfo } from './database/types';

    const CARD_SIZE_RATIO = 1024 / 1418;
    const CARD_ROUNDED_CLASS = 'rounded-[20px]';

    interface CardImageProps {
        card: CardInfo;
        class?: string;
        back?: boolean;
        shadowOpacity?: number;
    }

    let props: CardImageProps = $props();

    let cardFrontImage = $derived(
        new URL(`./assets/cards-front/tmp/card-${props.card.id}.webp`, import.meta.url).href,
    );

    let shadowOpacity = $derived(Math.max(Math.min(props.shadowOpacity ?? 1, 1), 0) * 25);
</script>

<div
    class="aspect-(--card-size-ratio) perspective-distant {props.class || ''}"
    style="--card-size-ratio: {CARD_SIZE_RATIO}; --card-shadow-opacity: {shadowOpacity}%;"
>
    <div
        class="relative h-full w-full transition-transform duration-800 transform-3d {props.back
            ? 'rotate-y-180'
            : ''}"
    >
        <HoverTilt
            class="absolute transition backface-hidden {CARD_ROUNDED_CLASS}"
            shadow
            shadowBlur={50}
            tiltFactor={0.75}
            scaleFactor={1.1}
        >
            <img
                alt="Card front"
                src={cardFrontImage}
                class="h-full w-full overflow-hidden {CARD_ROUNDED_CLASS} {!props.back
                    ? 'shadow-xl/(--card-shadow-opacity)'
                    : ''}"
                draggable="false"
            />
        </HoverTilt>
        <HoverTilt
            class="absolute rotate-y-180 transition backface-hidden {CARD_ROUNDED_CLASS}"
            shadow
            shadowBlur={50}
            tiltFactor={0.75}
            scaleFactor={1.1}
        >
            <img
                alt="Card back"
                src={cardBackImage}
                class="h-full w-full overflow-hidden {CARD_ROUNDED_CLASS} {props.back
                    ? 'shadow-xl/(--card-shadow-opacity)'
                    : ''}"
                draggable="false"
            />
        </HoverTilt>
    </div>
</div>
