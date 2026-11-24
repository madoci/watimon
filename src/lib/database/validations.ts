import { PACK, RARITY, type CardInfo, type PackInfo, type PackKey } from './types';

function logError(msg: string) {
    console.warn(`[CARD LIBRARY] ${msg}`);
}

function validateSetValues(label: string, values: unknown[], validValues: unknown[]) {
    const valuesSet = new Set(values);
    for (const rarity of valuesSet) {
        if (!validValues.includes(rarity)) {
            logError(`Invalid ${label} value "${rarity}".`);
        }
    }
}

export function validateCardLibrary(library: CardInfo[]) {
    // Check ids
    const ids = library.map(({ id }) => id);
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
            logError(
                `Missing id${isRange ? `s '${missingRange[0]}' to '${missingRange[1]}'` : ` '${missingRange[0]}'`}.`,
            );
        }
    }

    // Check rarities
    validateSetValues(
        'rarity',
        library.map(({ rarity }) => rarity),
        Object.values(RARITY),
    );
}

export function validatePacks(packs: Record<PackKey, PackInfo>) {
    // Check pack keys
    validateSetValues('pack key', Object.keys(packs), Object.values(PACK));
}
