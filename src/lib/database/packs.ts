import { getCards } from './cards';
import packs from './packs.json';
import {
    addPackToCollection,
    getCollection,
    getLastPack,
    getLastPackTimestamp,
} from '../storage-data';
import { RARITY, type CardInfo, type PackInfo, type PackKey, type Rarity } from './types';
import { validatePacks } from './validations';

//const PACK_OPENING_DELAY = 24 * 60 * 60;
const PACK_OPENING_DELAY = 60;

const PACKS = packs as Record<PackKey, PackInfo>;

// Validate types of the pack database
validatePacks(PACKS);

export function getRemainingTime(timestamp: number) {
    const canOpen = canOpenPack();
    const lastPackTimestamp = getLastPackTimestamp();
    return canOpen
        ? -1
        : Math.ceil(Math.max(0, PACK_OPENING_DELAY - (timestamp - lastPackTimestamp) / 1000));
}

export function canOpenPack() {
    const lastTimestamp = getLastPackTimestamp();
    if (lastTimestamp < 0) {
        return 1;
    }
    const timeSinceLastPack = (Date.now() - lastTimestamp) / 1000;
    return Math.floor(timeSinceLastPack / PACK_OPENING_DELAY);
}

export function openPack(packKey: PackKey): CardInfo[] {
    const cards = getCards();

    if (!canOpenPack()) {
        // If a new pack cannot be opened, we return the last pack
        const lastPack = getLastPack();
        if (!lastPack) {
            throw new Error('Pack could not be retrieved');
        }
        return lastPack.cards
            .map((id) => cards.find((c) => c?.id === id))
            .filter((c): c is CardInfo => !!c);
    }

    const collection = getCollection();
    const pools = cards.reduce<{ [K in Rarity]?: CardInfo[] }>((res, card) => {
        if (card && !collection[card.id]) {
            if (!res[card.rarity]) {
                res[card.rarity] = [];
            }
            res[card.rarity]?.push(card);
        }
        return res;
    }, {});

    const packCards: CardInfo[] = [];
    for (const cardDistribution of PACKS[packKey].distribution) {
        // Calculate cumulative distribution
        const cumulativeDistribution: [Rarity, number][] = [];
        let sum = 0;
        for (const [r, p] of Object.entries(cardDistribution)) {
            const rarity = r as Rarity;
            // Ignore rarity if pool is empty
            if (pools[rarity]?.length) {
                sum += p;
                cumulativeDistribution.push([rarity, sum]);
            }
        }

        // Pick a rarity based on probability
        const random = Math.random() * sum;
        const pickedRarity =
            cumulativeDistribution.find(([_, p]) => random < p)?.[0] ?? RARITY.common;

        // Pick a card in the selected pool
        const poolIndex = Math.floor(Math.random() * (pools[pickedRarity]?.length ?? 0));
        const pickedCard = pools[pickedRarity]?.[poolIndex];

        // Remove the picked card from the pool
        pools[pickedRarity]?.splice(poolIndex, 1);

        // Add card to pack
        if (pickedCard) {
            packCards.push(pickedCard);
        }
    }

    // Save picked cards to the stored collection
    addPackToCollection(packCards.map((card) => card.id));

    return packCards;
}
