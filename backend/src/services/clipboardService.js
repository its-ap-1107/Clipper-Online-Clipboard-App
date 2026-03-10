const store = require("./storeService");
const { createHttpError } = require("../utils/helpers");

async function listEntries(email) {
    if (!email) {
        throw createHttpError(400, "Email query parameter is required.");
    }

    const state = await store.readStore();
    const normalizedEmail = email.trim().toLowerCase();

    return state.entries
        .filter((entry) => entry.email === normalizedEmail)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

async function createEntry({ email, text = "", files = [] }) {
    if (!email) {
        throw createHttpError(400, "Email is required.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedText = text.trim();
    const normalizedFiles = Array.isArray(files)
        ? files.slice(0, 5).map((file) => ({
              name: String(file.name || "").trim(),
              size: Number(file.size) || 0,
          }))
        : [];

    if (!trimmedText && normalizedFiles.length === 0) {
        throw createHttpError(400, "Entry text or files are required.");
    }

    const state = await store.readStore();
    const hasUser = state.users.some((user) => user.email === normalizedEmail);

    if (!hasUser) {
        throw createHttpError(404, "User not found.");
    }

    const entry = {
        id: `entry_${Date.now()}`,
        email: normalizedEmail,
        text: trimmedText,
        files: normalizedFiles.filter((file) => file.name),
        createdAt: new Date().toISOString(),
    };

    state.entries = [entry, ...state.entries].slice(0, 100);
    await store.writeStore(state);

    return entry;
}

async function deleteEntry({ id, email }) {
    if (!email) {
        throw createHttpError(400, "Email query parameter is required.");
    }

    const state = await store.readStore();
    const normalizedEmail = email.trim().toLowerCase();
    const previousLength = state.entries.length;

    state.entries = state.entries.filter(
        (entry) => !(entry.id === id && entry.email === normalizedEmail)
    );

    if (state.entries.length === previousLength) {
        throw createHttpError(404, "Clipboard entry not found.");
    }

    await store.writeStore(state);
}

module.exports = {
    listEntries,
    createEntry,
    deleteEntry,
};
