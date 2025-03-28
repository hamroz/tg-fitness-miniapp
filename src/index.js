require('dotenv').config();
const { session, GrammyError, HttpError } = require('grammy');
const { conversations, createConversation } = require('@grammyjs/conversations');
const { connectToDatabase, closeConnection } = require('./config/database');
const User = require('./models/User');
const bot = require('./bot'); // Import the bot instance
const { adminUtils, NotificationScheduler } = require('./utils');
const SupportHandler = require('./handlers/supportHandler');
const {
    startHandler,
    helpHandler,
    subscribeHandler,
    openAppHandler
} = require('./handlers/commandHandlers');
const onboardingConversation = require('./handlers/onboardingConversation');

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

        // Initialize notification scheduler
        const scheduler = new NotificationScheduler(bot, db);
        scheduler.initializeScheduler();

        // Initialize support handler
        const supportHandler = new SupportHandler(bot);
        supportHandler.init();

        // Register the onboarding conversation
        bot.use(createConversation(
            (conversation, ctx) => onboardingConversation(conversation, ctx, userModel)
            , 'onboardingConversation'));

        // Register command handlers
        bot.command('start', async (ctx) => {
            const handler = startHandler(userModel);
            await handler(ctx);

            // Report new user registration to admin group
            const user = await userModel.getUserById(ctx.from.id);
            if (user) {
                adminUtils.reportNewUser(user).catch(console.error);
            }
        });

        bot.command('help', helpHandler(userModel));
        bot.command('subscribe', subscribeHandler(userModel));

        // Cancel command for exiting support mode
        bot.command('cancel', async (ctx) => {
            await supportHandler.handleCancelCommand(ctx);
        });

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
            scheduler.stopAll();
            await bot.stop();
            await closeConnection();
            process.exit(0);
        });

        process.once('SIGTERM', async () => {
            console.log('Stopping bot...');
            scheduler.stopAll();
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