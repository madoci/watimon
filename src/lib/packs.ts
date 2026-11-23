import { getCards, RARITY, type CardInfo, type Rarity } from './cards';
import { addPackToCollection, getCollection } from './storage-data';

type CardDistribution = { [K in Rarity]?: number };

const PACK_CARD_DISTRIBUTION: Record<'base', CardDistribution[]> = {
    base: [
        { [RARITY.COMMON]: 1 },
        { [RARITY.COMMON]: 1, [RARITY.RARE]: 0.1 },
        { [RARITY.RARE]: 1, [RARITY.MYTHIC]: 0.1 },
    ],
};

export function openPack() {
    const collection = getCollection();
    const cards = getCards();
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
    for (const cardDistribution of PACK_CARD_DISTRIBUTION.base) {
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
            cumulativeDistribution.find(([_, p]) => random < p)?.[0] ?? RARITY.COMMON;

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
