const User = require("../models/User");
const { createHttpError, sanitizeUser, validateEmail } = require("../utils/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register({ name, email, password }) {
    if (!name || !email || !password) {
        throw createHttpError(400, "Name, email, and password are required.");
    }

    if (!validateEmail(email)) {
        throw createHttpError(400, "A valid email is required.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
        throw createHttpError(409, "Account already exists for this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'super_secret_clipper_key_12345',
        { expiresIn: '7d' }
    );

    return {
        message: "Registration complete.",
        user: sanitizeUser(user),
        token,
    };
}

async function login({ email, password }) {
    if (!email || !password) {
        throw createHttpError(400, "Email and password are required.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
        throw createHttpError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createHttpError(401, "Invalid email or password.");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'super_secret_clipper_key_12345',
        { expiresIn: '7d' }
    );

    return {
        message: "Logged in.",
        user: sanitizeUser(user),
        token,
    };
}

module.exports = {
    register,
    login,
};
