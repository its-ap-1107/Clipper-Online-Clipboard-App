const Clip = require("../models/Clip");
const { createHttpError } = require("../utils/helpers");

async function generateUniqueCode() {
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
        const existing = await Clip.findOne({ where: { code } });
        if (!existing) {
            isUnique = true;
        }
    }

    return code;
}

async function createClip({ content, userId }) {
    if (!content || !content.trim()) {
        throw createHttpError(400, "Content is required.");
    }

    const code = await generateUniqueCode();

    // If not userId, set expiresAt to 24h from now
    let expiresAt = null;
    if (!userId) {
        const now = new Date();
        now.setHours(now.getHours() + 24);
        expiresAt = now;
    }

    const clip = await Clip.create({
        code,
        content: content.trim(),
        userId,
        expiresAt,
    });

    return {
        id: clip.id,
        code: clip.code,
        content: clip.content,
        expiresAt: clip.expiresAt,
    };
}

async function getClipByCode(code) {
    const clip = await Clip.findOne({ where: { code } });
    if (!clip) {
        throw createHttpError(404, "Clip not found or expired.");
    }

    return {
        id: clip.id,
        code: clip.code,
        content: clip.content,
        createdAt: clip.createdAt,
    };
}

module.exports = {
    createClip,
    getClipByCode,
};
