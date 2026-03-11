const clipboardService = require("../services/clipboardService");

async function createClip(req, res, next) {
    try {
        const { content } = req.body;
        // user might be undefined if guest
        const userId = req.user ? req.user.id : null;

        const clip = await clipboardService.createClip({ content, userId });
        res.status(201).json({ clip });
    } catch (error) {
        next(error);
    }
}

async function getClip(req, res, next) {
    try {
        const { code } = req.params;
        const clip = await clipboardService.getClipByCode(code);
        res.status(200).json({ clip });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createClip,
    getClip,
};
