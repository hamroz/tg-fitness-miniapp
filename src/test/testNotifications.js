require('dotenv').config();
const { connectToDatabase } = require('../config/database');
const bot = require('../bot');
const { NotificationScheduler } = require('../utils');

/**
 * Test script to manually trigger notifications
 * 
 * Run with: node src/test/testNotifications.js
 */
async function testNotifications() {
    try {
        console.log('Connecting to database...');
        const db = await connectToDatabase();

        console.log('Initializing notification scheduler...');
        const scheduler = new NotificationScheduler(bot, db);

        console.log('Testing workout reminder...');
        await scheduler.sendGeneralWorkoutReminder();

        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error during notification test:', error);
        process.exit(1);
    }
}

// Run the test
testNotifications(); 