const cron = require('node-cron');
const { Op } = require('sequelize');
const Clip = require('../models/Clip');

// Run this job every hour
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running clip cleanup job...');
        const now = new Date();
        const deletedCount = await Clip.destroy({
            where: {
                expiresAt: {
                    [Op.lt]: now
                }
            }
        });
        console.log(`Cleaned up ${deletedCount} expired clips.`);
    } catch (error) {
        console.error('Error during clip cleanup:', error);
    }
});
