const store = require("./storeService");
const { createHttpError, sanitizeUser, validateEmail } = require("../utils/helpers");

async function signup({ name, email, password }) {
    if (!name || !email || !password) {
        throw createHttpError(400, "Name, email, and password are required.");
    }

    if (!validateEmail(email)) {
        throw createHttpError(400, "A valid email is required.");
    }

    const state = await store.readStore();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = state.users.some((user) => user.email === normalizedEmail);

    if (exists) {
        throw createHttpError(409, "Account already exists for this email.");
    }

    const user = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
    };

    state.users.push(user);
    await store.writeStore(state);

    return {
        message: "Signup complete.",
        user: sanitizeUser(user),
    };
}

async function login({ email, password }) {
    if (!email || !password) {
        throw createHttpError(400, "Email and password are required.");
    }

    const state = await store.readStore();
    const normalizedEmail = email.trim().toLowerCase();
    const user = state.users.find(
        (account) => account.email === normalizedEmail && account.password === password
    );

    if (!user) {
        throw createHttpError(401, "Invalid email or password.");
    }

    return {
        message: "Logged in.",
        user: sanitizeUser(user),
    };
}

module.exports = {
    signup,
    login,
};
