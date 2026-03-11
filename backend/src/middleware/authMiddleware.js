const jwt = require("jsonwebtoken");
const { createHttpError } = require("../utils/helpers");

function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'super_secret_clipper_key_12345'
            );
            req.user = decoded; // { id, email, iat, exp }
        } catch (error) {
            // Invalid token, treat as guest
        }
    }

    // Either user is attached to req, or it's a guest request.
    next();
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return next(createHttpError(401, "Authentication required."));
    }
    next();
}

module.exports = {
    authenticateUser,
    requireAuth,
};
