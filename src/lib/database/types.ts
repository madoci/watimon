type Enum<T extends object> = T extends { [K in keyof T]: infer U } ? U : never;

export type Rarity = Enum<typeof RARITY>;
export type PackKey = Enum<typeof PACK>;

export interface CardInfo {
    id: number;
    name: string;
    rarity: Rarity;
}

export interface PackInfo {
    name: string;
    distribution: { [K in Rarity]?: number }[];
}

export const RARITY = {
    common: 'common',
    rare: 'rare',
    mythic: 'mythic',
} as const;

export const PACK = {
    forgottenCurse: 'forgottenCurse',
} as const;
