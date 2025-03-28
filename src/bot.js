require('dotenv').config();
const { Bot } = require('grammy');

// Check if bot token is provided
if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN not provided in .env file');
}

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN);

module.exports = bot; 