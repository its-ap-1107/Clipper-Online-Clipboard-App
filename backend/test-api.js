async function runTests() {
    console.log("--- Starting API Tests ---");

    // 1. Register User
    console.log("\n1. Registering user test@test.com...");
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test Server", email: "test2@test.com", password: "password123" })
    });
    const regData = await regRes.json();
    console.log("Register Response:", regRes.status, regData);

    // 2. Login User
    console.log("\n2. Logging in test@test.com...");
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test2@test.com", password: "password123" })
    });
    const loginData = await loginRes.json();
    console.log("Login Response:", loginRes.status, loginData.message);

    const token = loginData.token;

    // 3. Create Clip as Guest
    console.log("\n3. Creating Clip as GUEST...");
    const guestClipRes = await fetch("http://localhost:5000/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "This is a temporary guest clip" })
    });
    const guestClipData = await guestClipRes.json();
    console.log("Guest Clip Created:", guestClipData);
    const guestCode = guestClipData.clip.code;

    // 4. Retrieve Guest Clip
    console.log(`\n4. Retrieving Guest Clip by code [${guestCode}]...`);
    const getGuestRes = await fetch(`http://localhost:5000/api/clips/${guestCode}`);
    const getGuestData = await getGuestRes.json();
    console.log("Retrieved Guest Clip:", getGuestData);

    // 5. Create Clip as Authenticated User
    console.log("\n5. Creating Clip as AUTHENTICATED user...");
    const authClipRes = await fetch("http://localhost:5000/api/clips", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: "This is a PERMANENT user clip" })
    });
    const authClipData = await authClipRes.json();
    console.log("User Clip Created:", authClipData);
    const userCode = authClipData.clip.code;

    // 6. Retrieve User Clip
    console.log(`\n6. Retrieving User Clip by code [${userCode}]...`);
    const getUserRes = await fetch(`http://localhost:5000/api/clips/${userCode}`);
    const getUserData = await getUserRes.json();
    console.log("Retrieved User Clip:", getUserData);

    console.log("\n--- All Tests Completed ---");
}

runTests().catch(console.error);
