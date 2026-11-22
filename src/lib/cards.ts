type Enum<T extends object> = T extends { [K in keyof T]: infer U } ? U : never;

interface CardInfo {
	id: number;
	//image: string;
	rarity: Enum<typeof RARITY>;
}

export const RARITY = {
	COMMON: 'common',
	RARE: 'rare',
	MYTHIC: 'mythic',
} as const;

const CARD_LIBRARY: readonly CardInfo[] = [
	{
		id: 1,
		rarity: RARITY.COMMON,
	},
	{
		id: 2,
		rarity: RARITY.COMMON,
	},
	{
		id: 3,
		rarity: RARITY.COMMON,
	},
	{
		id: 4,
		rarity: RARITY.COMMON,
	},
	{
		id: 5,
		rarity: RARITY.COMMON,
	},
	{
		id: 6,
		rarity: RARITY.COMMON,
	},
];

// Check for inconsitencies in the card library
function validateCardLibrary() {
	const ids = CARD_LIBRARY.map(({ id }) => id);
	ids.sort((a, b) => a - b);
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		if (id <= 0) {
			console.warn(`[CARD LIBRARY] Invalid id '${id}': id must be strictly positive.`);
		}
		if (i > 0 && ids[i - 1] === id) {
			console.warn(`[CARD LIBRARY] Duplicate id '${id}'.`);
		} else if (i > 0 && ids[i - 1] !== id - 1) {
			const missingRange = [ids[i - 1] + 1, id - 1];
			const isRange = missingRange[0] !== missingRange[1];
			console.warn(
				`[CARD LIBRARY] Missing id${isRange ? `s '${missingRange[0]}' to '${missingRange[1]}'` : ` '${missingRange[0]}'`}.`,
			);
		}
	}
}
validateCardLibrary();

const MAX_ID = CARD_LIBRARY.reduce((max, card) => {
	return Math.max(card.id, max);
}, 0);

const INDEXED_CARDS = CARD_LIBRARY.reduce(
	(res, card) => {
		res[card.id] = card;
		return res;
	},
	new Array<CardInfo | undefined>(MAX_ID - 1).fill(undefined),
);

export function getCards(): readonly (CardInfo | undefined)[] {
	return INDEXED_CARDS;
}
