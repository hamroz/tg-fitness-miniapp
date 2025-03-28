require('dotenv').config();
const { Bot, session, GrammyError, HttpError } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { connectToDatabase, closeConnection } = require('./config/database');
const User = require('./models/User');
const {
    startHandler,
    helpHandler,
    subscribeHandler,
    supportHandler,
    openAppHandler
} = require('./handlers/commandHandlers');
const onboardingConversation = require('./handlers/onboardingConversation');

// Check if bot token is provided
if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN not provided in .env file');
}

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN);

// Set up sessions and conversations middleware
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

// Initialize the bot with database connection
async function initBot() {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        console.log('Connected to database');

        // Initialize user model
        const userModel = new User(db);

        // Register the onboarding conversation
        bot.use(createConversation(
            (conversation, ctx) => onboardingConversation(conversation, ctx, userModel)
            , 'onboardingConversation'));

        // Register command handlers
        bot.command('start', startHandler(userModel));
        bot.command('help', helpHandler(userModel));
        bot.command('subscribe', subscribeHandler(userModel));
        bot.command('support', supportHandler(userModel));

        // Register callback query handlers
        bot.callbackQuery('open_app', openAppHandler());

        // Handle errors
        bot.catch((err) => {
            console.error('Bot error:', err);

            if (err instanceof GrammyError) {
                console.error('Error in request:', err.description);
            } else if (err instanceof HttpError) {
                console.error('Could not contact Telegram:', err);
            } else {
                console.error('Unknown error:', err);
            }
        });

        // Start the bot
        console.log('Starting bot...');
        await bot.start();

        // Handle shutdown
        process.once('SIGINT', async () => {
            console.log('Stopping bot...');
            await bot.stop();
            await closeConnection();
            process.exit(0);
        });

        process.once('SIGTERM', async () => {
            console.log('Stopping bot...');
            await bot.stop();
            await closeConnection();
            process.exit(0);
        });

    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Run the bot
initBot().catch(console.error); 