const authService = require("../services/authService");

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const result = await authService.register({ name, email, password });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
};
