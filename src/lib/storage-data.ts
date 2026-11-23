// All stored data versions are kept for migration purposes
interface StorageDataV1 {
    v: 1;
    collection: boolean[];
    lastPack: {
        datetime: string;
        cards: number[];
    } | null;
}

// Keep track of current data version
type StorageData = StorageDataV1;

const STORAGE_KEY = 'data';
const SAVED_DATA_STALE_DELAY = 60 * 60 * 1000; // 1 hour

let savedDataTimestamp = Date.now();
let savedData = readData() ?? createData();

function decodeCollection(str: string) {
    const array = Array.from(Uint8Array.fromBase64(str));
    const collection = new Array(array.length * 8).fill(false);
    for (let i = 0; i < array.length; i++) {
        let value = array[i];
        for (let j = 0; j < 8; j++) {
            collection[i * 8 + j] = (value & 1) === 1;
            value >>= 1;
        }
    }
    return collection;
}

function encodeCollection(collection: boolean[]) {
    const length = Math.ceil(collection.length / 8);
    const array = new Array(length).fill(0);
    for (let i = 0; i < length; i++) {
        let value = 0;
        for (let j = 0; j < 8; j++) {
            if (j > 0) {
                // Don't shift on the first one
                value <<= 1;
            }
            value |= collection[i * 8 + (7 - j)] ? 1 : 0;
        }
        array[i] = value;
    }
    return new Uint8Array(array).toBase64();
}

function createData(from?: Partial<StorageData>): StorageData {
    return {
        v: 1,
        collection: from?.collection ?? [],
        lastPack: from?.lastPack ?? null,
    };
}

function readData(): StorageData | undefined {
    let data: StorageData | undefined;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const decoded = atob(stored);
            const parsed = JSON.parse(decoded);
            data = createData({
                collection: decodeCollection(`${parsed?.collection}`),
                lastPack: parsed?.lastPack,
            });
            savedDataTimestamp = Date.now();
        }
    } catch (e) {
        console.error('Unable to read stored data', e);
    }

    return data;
}

function writeData(data: StorageData) {
    try {
        const stringified = JSON.stringify({
            ...data,
            collection: encodeCollection(data.collection),
        });
        const encoded = btoa(stringified);
        localStorage.setItem(STORAGE_KEY, encoded);
    } catch (e) {
        console.error('Unable to store data', e);
    }
}

function getData(forceRead?: boolean) {
    // Attempt to refresh data from local storage if considered stale
    if (forceRead || Date.now() - savedDataTimestamp > SAVED_DATA_STALE_DELAY) {
        const newData = readData();
        // If it fails, we use the previously obtained read data
        if (newData) {
            savedData = newData;
        }
    }

    return savedData;
}

function setData(data: Partial<StorageData>) {
    const currentData = getData();
    const newData = { ...currentData, ...data };
    writeData(newData);
    savedData = newData;
}

export function readDataFromStorage() {
    getData(true);
}

export function getCollection() {
    return getData().collection;
}

export function getLastPack() {
    return getData().lastPack;
}

export function getLastPackTimestamp() {
    const lastPack = getData().lastPack;
    const lastTimestamp = new Date(lastPack?.datetime ?? '').getTime();
    return Number.isNaN(lastTimestamp) ? -Infinity : lastTimestamp;
}

export function addPackToCollection(cardIds: number[]) {
    const collection = [...getCollection()];
    for (const cardId of cardIds) {
        collection[cardId] = true;
    }
    setData({
        collection,
        lastPack: {
            datetime: new Date().toString(),
            cards: cardIds,
        },
    });
}

export function clearStorageData() {
    setData(createData());
}
