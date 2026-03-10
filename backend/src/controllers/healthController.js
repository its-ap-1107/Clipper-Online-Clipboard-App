function getHealth(req, res) {
    res.status(200).json({
        status: "ok",
        service: "clipper-backend",
        timestamp: new Date().toISOString(),
    });
}

module.exports = {
    getHealth,
};
