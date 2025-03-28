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
                ? `👋 *Welcome back, ${user.name}!*\n\nI'm your personal fitness assistant. What would you like to do today?`
                : `👋 *С возвращением, ${user.name}!*\n\nЯ твой персональный фитнес-ассистент. Что бы ты хотел(а) сделать сегодня?`;

            const keyboard = new InlineKeyboard()
                .text(user.language === 'en' ? '📱 Open App' : '📱 Открыть приложение', 'open_app')
                .row()
                .text(user.language === 'en' ? '📋 Commands' : '📋 Команды', 'show_commands')
                .row()
                .text(user.language === 'en' ? '🏋️ Quick Workout' : '🏋️ Быстрая тренировка', 'quick_workout')
                .row()
                .text(user.language === 'en' ? '🔔 Notifications' : '🔔 Уведомления', 'notifications_settings');

            await ctx.reply(greeting, {
                reply_markup: keyboard,
                parse_mode: 'Markdown'
            });
        } else {
            // New user - start onboarding
            await ctx.conversation.enter('onboardingConversation');
        }
    };
}

/**
 * Handler for /menu command - shows interactive menu
 */
function menuHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        // Default to Russian
        const language = user?.language || 'ru';

        const menuText = language === 'en'
            ? `*📱 Main Menu*\n\nChoose an option below:`
            : `*📱 Главное Меню*\n\nВыберите опцию ниже:`;

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '📱 Open App' : '📱 Открыть приложение', 'open_app')
            .row()
            .text(language === 'en' ? '💪 My Workouts' : '💪 Мои тренировки', 'my_workouts')
            .row()
            .text(language === 'en' ? '📊 My Progress' : '📊 Мой прогресс', 'my_progress')
            .row()
            .text(language === 'en' ? '🔔 Notifications' : '🔔 Уведомления', 'notifications_settings')
            .row()
            .text(language === 'en' ? '🌐 Language' : '🌐 Язык', 'show_language')
            .row()
            .text(language === 'en' ? '⚙️ Settings' : '⚙️ Настройки', 'settings')
            .row()
            .text(language === 'en' ? '💬 Support' : '💬 Поддержка', 'support_menu');

        await ctx.reply(menuText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    };
}

/**
 * Handler for /commands command - shows all available commands
 */
function commandsHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const language = user?.language || 'ru';

        const commandsText = language === 'en'
            ? `*📋 Available Commands*

/start - Restart the bot
/menu - Show interactive menu
/commands - Show this commands list
/workout - Start a quick workout
/progress - View your fitness progress
/subscribe - View subscription options
/support - Contact our support team
/settings - Change your preferences
/notifications - Manage notification settings
/language - Change language
/help - Get help using the bot
/cancel - Cancel current operation

_Use the interactive menu for easier navigation!_`
            : `*📋 Доступные Команды*

/start - Перезапустить бота
/menu - Показать интерактивное меню
/commands - Показать этот список команд
/workout - Начать быструю тренировку
/progress - Посмотреть ваш прогресс
/subscribe - Посмотреть варианты подписки
/support - Связаться со службой поддержки
/settings - Изменить ваши настройки
/notifications - Управление уведомлениями
/language - Изменить язык
/help - Получить помощь по использованию бота
/cancel - Отменить текущую операцию

_Используйте интерактивное меню для более удобной навигации!_`;

        await ctx.reply(commandsText, {
            parse_mode: 'Markdown'
        });
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
            ? `*🆘 Help & Support*

*Getting Started:*
• Use /start to begin interaction with the bot
• Use /menu to access the main menu
• Use /commands to see all available commands

*Common Tasks:*
• Track your workouts in the app or via /workout
• Check your progress with /progress
• Manage subscriptions with /subscribe

*Need More Help?*
Use /support to contact our team directly.

*Tip:* You can always use /cancel to exit any ongoing process.`
            : `*🆘 Помощь & Поддержка*

*Начало работы:*
• Используйте /start для начала работы с ботом
• Используйте /menu для доступа к главному меню
• Используйте /commands чтобы увидеть все доступные команды

*Частые задачи:*
• Отслеживайте тренировки в приложении или через /workout
• Проверяйте свой прогресс с помощью /progress
• Управляйте подписками через /subscribe

*Нужна дополнительная помощь?*
Используйте /support чтобы связаться с нашей командой напрямую.

*Совет:* Вы всегда можете использовать /cancel для выхода из любого текущего процесса.`;

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '📱 Open App' : '📱 Открыть приложение', 'open_app')
            .row()
            .text(language === 'en' ? '💬 Contact Support' : '💬 Связаться с поддержкой', 'support_contact')
            .row()
            .text(language === 'en' ? '📋 Commands' : '📋 Команды', 'show_commands');

        await ctx.reply(helpText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
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

        const currentPlan = user?.subscription || 'free';
        const planEmoji = currentPlan === 'premium' ? '⭐' : (currentPlan === 'individual' ? '🌟' : '🔹');

        const subscribeText = language === 'en'
            ? `*💰 Subscription Options*\n\n*Your current plan:* ${planEmoji} *${currentPlan.toUpperCase()}*\n\nChoose a subscription plan to view details and upgrade options:`
            : `*💰 Варианты Подписки*\n\n*Ваш текущий план:* ${planEmoji} *${currentPlan.toUpperCase()}*\n\nВыберите план подписки, чтобы просмотреть детали и варианты обновления:`;

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '🔹 Free Plan' : '🔹 Бесплатный План', 'plan_free')
            .row()
            .text(language === 'en' ? '⭐ Premium Plan' : '⭐ Премиум План', 'plan_premium')
            .row()
            .text(language === 'en' ? '🌟 Individual Plan' : '🌟 Индивидуальный План', 'plan_individual')
            .row()
            .text(language === 'en' ? '📱 Open App for Details' : '📱 Открыть приложение', 'open_app');

        await ctx.reply(subscribeText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
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
            ? `*💬 Support Center*

Need help with something? Our support team is here for you!

*Options:*
• Send us a message directly using this bot
• Check our FAQ for quick answers
• Report a technical issue`
            : `*💬 Центр Поддержки*

Нужна помощь? Наша команда поддержки здесь для вас!

*Варианты:*
• Отправьте нам сообщение напрямую через этого бота
• Ознакомьтесь с часто задаваемыми вопросами
• Сообщите о технической проблеме`;

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '📝 Send Message' : '📝 Отправить сообщение', 'support_message')
            .row()
            .text(language === 'en' ? '❓ FAQ' : '❓ FAQ', 'support_faq')
            .row()
            .text(language === 'en' ? '🐞 Report Bug' : '🐞 Сообщить об ошибке', 'support_bug');

        await ctx.reply(supportText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    };
}

/**
 * Handler for /workout command
 * Offers quick workout options
 */
function workoutHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const language = user?.language || 'ru';

        const workoutText = language === 'en'
            ? `*🏋️ Quick Workout*

Choose a workout type below or open the app for a complete workout experience:

• *Quick:* 10-15 minute workout for busy days
• *Medium:* 20-30 minute balanced session
• *Full:* 45-60 minute complete workout`
            : `*🏋️ Быстрая Тренировка*

Выберите тип тренировки ниже или откройте приложение для полного тренировочного опыта:

• *Быстрая:* 10-15 минутная тренировка для занятых дней
• *Средняя:* 20-30 минутная сбалансированная сессия
• *Полная:* 45-60 минутная полная тренировка`;

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '⚡ Quick (15 min)' : '⚡ Быстрая (15 мин)', 'workout_quick')
            .row()
            .text(language === 'en' ? '🔄 Medium (30 min)' : '🔄 Средняя (30 мин)', 'workout_medium')
            .row()
            .text(language === 'en' ? '💪 Full (60 min)' : '💪 Полная (60 мин)', 'workout_full')
            .row()
            .text(language === 'en' ? '📱 Open App' : '📱 Открыть приложение', 'open_app');

        await ctx.reply(workoutText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    };
}

/**
 * Handler for /cancel command
 * Used to cancel ongoing operations
 */
function cancelHandler() {
    return async (ctx) => {
        // Default to Russian
        const language = 'ru';

        const cancelText = language === 'en'
            ? '✅ Current operation has been cancelled. What would you like to do next?'
            : '✅ Текущая операция была отменена. Что бы вы хотели сделать дальше?';

        const keyboard = new InlineKeyboard()
            .text(language === 'en' ? '📱 Main Menu' : '📱 Главное Меню', 'show_menu')
            .row()
            .text(language === 'en' ? '📋 Commands' : '📋 Команды', 'show_commands');

        await ctx.reply(cancelText, {
            reply_markup: keyboard
        });
    };
}

/**
 * Handler for inline button that opens the mini app
 */
function openAppHandler() {
    return async (ctx) => {
        // Default to Russian
        const language = 'ru';
        const miniAppUrl = process.env.MINI_APP_URL;

        const openMessage = language === 'en'
            ? `*📱 Opening Fitness Trainer App*\n\nClick below to open the full app experience!`
            : `*📱 Открытие Фитнес-Тренера*\n\nНажмите ниже, чтобы открыть полное приложение!`;

        await ctx.reply(openMessage, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: language === 'en' ? '🚀 Launch App' : '🚀 Запустить приложение', web_app: { url: miniAppUrl } }]
                ]
            }
        });
    };
}

/**
 * Handler for /language command
 * Shows language selection options
 */
function languageHandler(userModel) {
    return async (ctx) => {
        const userId = ctx.from.id.toString();
        const user = await userModel.getUserById(userId);
        const currentLanguage = user?.language || 'ru'; // Default to Russian

        const languageText = currentLanguage === 'en'
            ? `*🌐 Language Settings*\n\nYour current language is: *English*\n\nSelect your preferred language:`
            : `*🌐 Настройки Языка*\n\nВаш текущий язык: *Русский*\n\nВыберите предпочитаемый язык:`;

        const keyboard = new InlineKeyboard()
            .text('🇷🇺 Русский', 'language_ru')
            .row()
            .text('🇬🇧 English', 'language_en');

        await ctx.reply(languageText, {
            reply_markup: keyboard,
            parse_mode: 'Markdown'
        });
    };
}

/**
 * Handler for callback_query 'show_commands'
 * Shows available commands
 */
function showCommandsHandler(userModel) {
    return async (ctx) => {
        const handler = commandsHandler(userModel);
        await handler(ctx);
        await ctx.answerCallbackQuery();
    };
}

/**
 * Handler for callback_query 'show_menu'
 * Shows the main menu
 */
function showMenuHandler(userModel) {
    return async (ctx) => {
        const handler = menuHandler(userModel);
        await handler(ctx);
        await ctx.answerCallbackQuery();
    };
}

/**
 * Handler for callback_query 'show_language'
 * Shows language selection
 */
function showLanguageHandler(userModel) {
    return async (ctx) => {
        const handler = languageHandler(userModel);
        await handler(ctx);
        await ctx.answerCallbackQuery();
    };
}

module.exports = {
    startHandler,
    menuHandler,
    helpHandler,
    subscribeHandler,
    supportHandler,
    cancelHandler,
    openAppHandler,
    commandsHandler,
    workoutHandler,
    showCommandsHandler,
    showMenuHandler,
    languageHandler,
    showLanguageHandler
}; 