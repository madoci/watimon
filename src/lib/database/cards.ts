import { library } from './cards.json';
import type { CardInfo } from './types';
import { validateCardLibrary } from './validations';

const CARD_LIBRARY = library as CardInfo[];

// Validate types and check for inconsitencies in the card library
validateCardLibrary(CARD_LIBRARY);

const MAX_ID = CARD_LIBRARY.reduce((max, card) => {
    return Math.max(card.id, max);
}, 0);

const INDEXED_CARDS = CARD_LIBRARY.reduce((res, card) => {
    res[card.id] = card;
    return res;
}, new Array<CardInfo | undefined>(MAX_ID).fill(undefined));

export function getCards(): readonly (CardInfo | undefined)[] {
    return INDEXED_CARDS;
}
