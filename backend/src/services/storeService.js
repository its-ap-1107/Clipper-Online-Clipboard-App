const fs = require("fs/promises");
const path = require("path");

const dataDirectory = path.join(__dirname, "..", "..", "data");
const storeFilePath = path.join(dataDirectory, "store.json");

const defaultStore = {
    users: [],
    entries: [],
};

async function ensureStoreFile() {
    await fs.mkdir(dataDirectory, { recursive: true });

    try {
        await fs.access(storeFilePath);
    } catch (error) {
        await fs.writeFile(storeFilePath, JSON.stringify(defaultStore, null, 2));
    }
}

async function readStore() {
    await ensureStoreFile();
    const raw = await fs.readFile(storeFilePath, "utf8");

    try {
        const parsed = JSON.parse(raw);
        return {
            users: Array.isArray(parsed.users) ? parsed.users : [],
            entries: Array.isArray(parsed.entries) ? parsed.entries : [],
        };
    } catch (error) {
        await fs.writeFile(storeFilePath, JSON.stringify(defaultStore, null, 2));
        return { ...defaultStore };
    }
}

async function writeStore(nextState) {
    await ensureStoreFile();
    await fs.writeFile(storeFilePath, JSON.stringify(nextState, null, 2));
}

module.exports = {
    readStore,
    writeStore,
};
