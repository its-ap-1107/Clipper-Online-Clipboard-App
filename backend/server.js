const app = require("./src/app");
const sequelize = require("./src/config/database");

// Initialize cron jobs
require("./src/utils/cron");

const PORT = Number(process.env.PORT) || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
        console.log(`Clipper backend listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to sync database:", err);
});
