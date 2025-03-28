const { InlineKeyboard } = require('grammy');
require('dotenv').config();

/**
 * Handler for /start command - begins user onboarding
 */
function startHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);

        if (user) {
            // User already exists
            const greeting = user.language === 'en'
                ? `Welcome back, ${user.name}! How can I help you today?`
                : `С возвращением, ${user.name}! Чем я могу помочь сегодня?`;

            const keyboard = new InlineKeyboard()
                .text(user.language === 'en' ? 'Open App' : 'Открыть приложение', 'open_app');

            await ctx.reply(greeting, {
                reply_markup: keyboard
            });
        } else {
            // New user - start onboarding
            await ctx.conversation.enter('onboardingConversation');
        }
    };
}

/**
 * Handler for /help command
 */
function helpHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const language = user?.language || 'ru';

        const helpText = language === 'en'
            ? `Here's how I can help you:
        
/start - Start the bot
/help - Show this help message
/subscribe - View subscription options
/support - Contact our support team`
            : `Вот чем я могу помочь:
        
/start - Запустить бота
/help - Показать это сообщение
/subscribe - Посмотреть варианты подписки
/support - Связаться с нашей службой поддержки`;

        await ctx.reply(helpText);
    };
}

/**
 * Handler for /subscribe command
 */
function subscribeHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const language = user?.language || 'ru';

        const subscribeText = language === 'en'
            ? 'Subscription options will be available soon!'
            : 'Варианты подписки будут доступны в ближайшее время!';

        await ctx.reply(subscribeText);
    };
}

/**
 * Handler for /support command
 */
function supportHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const language = user?.language || 'ru';

        const supportText = language === 'en'
            ? 'For support, please contact us at: support@fitnessbot.com'
            : 'Для поддержки, пожалуйста, свяжитесь с нами: support@fitnessbot.com';

        await ctx.reply(supportText);
    };
}

/**
 * Handler for inline button that opens the mini app
 */
function openAppHandler() {
    return async (ctx) => {
        const miniAppUrl = process.env.MINI_APP_URL;
        await ctx.reply(`🔗 ${miniAppUrl}`);
    };
}

module.exports = {
    startHandler,
    helpHandler,
    subscribeHandler,
    supportHandler,
    openAppHandler
}; 