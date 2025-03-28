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
    menuHandler,
    helpHandler,
    subscribeHandler,
    openAppHandler,
    commandsHandler,
    workoutHandler,
    showCommandsHandler,
    showMenuHandler,
    languageHandler,
    showLanguageHandler
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

        // Set bot commands for the menu
        await bot.api.setMyCommands([
            { command: "start", description: "Старт (Start)" },
            { command: "menu", description: "Меню (Menu)" },
            { command: "commands", description: "Команды (Commands)" },
            { command: "workout", description: "Тренировка (Workout)" },
            { command: "progress", description: "Прогресс (Progress)" },
            { command: "subscribe", description: "Подписка (Subscribe)" },
            { command: "language", description: "Язык (Language)" },
            { command: "support", description: "Поддержка (Support)" },
            { command: "help", description: "Помощь (Help)" }
        ]);

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

        bot.command('menu', menuHandler(userModel));
        bot.command('commands', commandsHandler(userModel));
        bot.command('help', helpHandler(userModel));
        bot.command('subscribe', subscribeHandler(userModel));
        bot.command('workout', workoutHandler(userModel));
        bot.command('language', languageHandler(userModel));

        // Cancel command for exiting support mode
        bot.command('cancel', async (ctx) => {
            await supportHandler.handleCancelCommand(ctx);
        });

        // Register callback query handlers
        bot.callbackQuery('open_app', openAppHandler());
        bot.callbackQuery('show_commands', showCommandsHandler(userModel));
        bot.callbackQuery('show_menu', showMenuHandler(userModel));
        bot.callbackQuery('show_language', showLanguageHandler(userModel));

        // Handle language change callbacks
        bot.callbackQuery(/^language_/, async (ctx) => {
            const language = ctx.callbackQuery.data.split('_')[1]; // 'ru' or 'en'
            const userId = ctx.from.id.toString();

            // Update user language in database
            await userModel.updateUser(userId, { language });

            // Get user to check if update was successful
            const user = await userModel.getUserById(userId);

            // Prepare confirmation message
            const message = language === 'en'
                ? `✅ Language changed to *English*!`
                : `✅ Язык изменен на *Русский*!`;

            // Send confirmation
            await ctx.reply(message, { parse_mode: 'Markdown' });

            // Show updated menu
            const menuHandler = showMenuHandler(userModel);
            await menuHandler(ctx);
        });

        // Handle quick workout callbacks
        bot.callbackQuery(/^workout_/, async (ctx) => {
            const workoutType = ctx.callbackQuery.data.split('_')[1];
            const userId = ctx.from.id.toString();

            // Get user language, default to Russian
            let language = 'ru';
            try {
                const user = await userModel.getUserById(userId);
                if (user && user.language) {
                    language = user.language;
                }
            } catch (error) {
                console.error('Error getting user language:', error);
            }

            let message = '';
            if (language === 'en') {
                message = `🏋️ Great choice! Opening a ${workoutType} workout for you.\n\nIn a real implementation, this would open a specific workout in the app.`;
            } else {
                message = `🏋️ Отличный выбор! Открываю ${workoutType === 'quick' ? 'быструю' : workoutType === 'medium' ? 'среднюю' : 'полную'} тренировку для вас.\n\nВ реальной реализации, это бы открыло конкретную тренировку в приложении.`;
            }

            await ctx.reply(message);
            await ctx.answerCallbackQuery();
        });

        // Handle support-related callbacks
        bot.callbackQuery('support_message', async (ctx) => {
            await supportHandler.handleSupportCommand(ctx);
            await ctx.answerCallbackQuery();
        });

        // Handle subscription plan callbacks
        bot.callbackQuery(/^plan_/, async (ctx) => {
            const planType = ctx.callbackQuery.data.split('_')[1];
            const userId = ctx.from.id.toString();

            // Get user language, default to Russian
            let language = 'ru';
            try {
                const user = await userModel.getUserById(userId);
                if (user && user.language) {
                    language = user.language;
                }
            } catch (error) {
                console.error('Error getting user language:', error);
            }

            let planName, planFeatures, planPrice;

            if (planType === 'free') {
                planName = language === 'en' ? 'Free Plan' : 'Бесплатный План';
                planFeatures = language === 'en' ?
                    '• Basic exercises\n• Exercise timer\n• Progress tracking' :
                    '• Базовые упражнения\n• Таймер упражнений\n• Отслеживание прогресса';
                planPrice = language === 'en' ? 'Free' : 'Бесплатно';
            } else if (planType === 'premium') {
                planName = language === 'en' ? 'Premium Plan' : 'Премиум План';
                planFeatures = language === 'en' ?
                    '• All Free features\n• Premium exercises\n• Personalized workout plans\n• Priority support' :
                    '• Все функции бесплатного плана\n• Премиум упражнения\n• Персонализированные планы тренировок\n• Приоритетная поддержка';
                planPrice = '$5/month';
            } else {
                planName = language === 'en' ? 'Individual Plan' : 'Индивидуальный План';
                planFeatures = language === 'en' ?
                    '• All Premium features\n• Custom fitness plan\n• Personal coaching\n• VIP support' :
                    '• Все функции премиум плана\n• Индивидуальный фитнес-план\n• Персональные тренировки\n• VIP поддержка';
                planPrice = '$10/month';
            }

            const message = language === 'en' ?
                `*${planName}*\n\n*Price:* ${planPrice}\n\n*Features:*\n${planFeatures}\n\nUpgrade in the app for full access!` :
                `*${planName}*\n\n*Цена:* ${planPrice}\n\n*Функции:*\n${planFeatures}\n\nОбновите в приложении для полного доступа!`;

            await ctx.reply(message, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: language === 'en' ? '📱 Open App' : '📱 Открыть приложение', web_app: { url: process.env.MINI_APP_URL + '/subscription' } }]
                    ]
                }
            });
            await ctx.answerCallbackQuery();
        });

        // Handle notifications settings
        bot.callbackQuery('notifications_settings', async (ctx) => {
            const userId = ctx.from.id.toString();

            // Get user language, default to Russian
            let language = 'ru';
            try {
                const user = await userModel.getUserById(userId);
                if (user && user.language) {
                    language = user.language;
                }
            } catch (error) {
                console.error('Error getting user language:', error);
            }

            const message = language === 'en' ?
                `*🔔 Notification Settings*\n\nManage your workout reminders and other notifications in the app:` :
                `*🔔 Настройки уведомлений*\n\nУправляйте напоминаниями о тренировках и другими уведомлениями в приложении:`;

            await ctx.reply(message, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: language === 'en' ? '📱 Open Settings' : '📱 Открыть настройки', web_app: { url: process.env.MINI_APP_URL + '/settings' } }]
                    ]
                }
            });
            await ctx.answerCallbackQuery();
        });

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