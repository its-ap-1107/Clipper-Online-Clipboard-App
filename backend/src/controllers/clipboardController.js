const clipboardService = require("../services/clipboardService");

async function listEntries(req, res, next) {
    try {
        const { email } = req.query;
        const entries = await clipboardService.listEntries(email);
        res.status(200).json({ entries });
    } catch (error) {
        next(error);
    }
}

async function createEntry(req, res, next) {
    try {
        const entry = await clipboardService.createEntry(req.body);
        res.status(201).json({ entry });
    } catch (error) {
        next(error);
    }
}

async function deleteEntry(req, res, next) {
    try {
        const { id } = req.params;
        const { email } = req.query;
        await clipboardService.deleteEntry({ id, email });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listEntries,
    createEntry,
    deleteEntry,
};
