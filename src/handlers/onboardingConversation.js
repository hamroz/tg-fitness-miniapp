const { InlineKeyboard } = require('grammy');

/**
 * Onboarding conversation to collect user information
 * @param {Object} conversation - The conversation context
 * @param {Object} ctx - The bot context
 * @param {Object} userModel - The user model for database operations
 */
async function onboardingConversation(conversation, ctx, userModel) {
    // Welcome greeting with emoji and formatting in Russian
    await ctx.reply('🏋️‍♂️ *Добро пожаловать в Фитнес-Тренер Бот!* 🏋️‍♀️', {
        parse_mode: 'Markdown'
    });

    // Introduction message in Russian
    await ctx.reply("Я твой персональный фитнес-ассистент, который поможет тебе достичь твоих фитнес-целей! Давай познакомимся.", {
        parse_mode: 'Markdown'
    });

    // Ask for name with emoji in Russian
    await ctx.reply('👋 *Как тебя зовут?*', {
        parse_mode: 'Markdown'
    });
    const nameResponse = await conversation.wait();
    const name = nameResponse.message.text;

    // Acknowledge name in Russian
    await ctx.reply(`Приятно познакомиться, *${name}*! 😊`, {
        parse_mode: 'Markdown'
    });

    // Ask for fitness goals with attractive buttons in Russian
    await ctx.reply('💪 *Какая у тебя основная фитнес-цель?*', {
        parse_mode: 'Markdown'
    });

    const goalsKeyboard = new InlineKeyboard()
        .text('🔥 Похудение', 'goal_weight_loss')
        .row()
        .text('💪 Набор мышечной массы', 'goal_muscle_gain')
        .row()
        .text('⚖️ Поддержание формы', 'goal_maintenance');

    await ctx.reply('Выбери свою основную цель:', {
        reply_markup: goalsKeyboard
    });

    const goalsResponse = await conversation.wait();
    let goals;

    if (goalsResponse.callbackQuery) {
        const data = goalsResponse.callbackQuery.data;
        if (data === 'goal_weight_loss') {
            goals = 'weight_loss';
            await ctx.reply('🔥 *Отличный выбор!* Похудение - это отличная цель. Я помогу тебе сжечь эти калории!', {
                parse_mode: 'Markdown'
            });
        } else if (data === 'goal_muscle_gain') {
            goals = 'muscle_gain';
            await ctx.reply('💪 *Превосходно!* Набор мышечной массы - это полезное путешествие. Я помогу тебе нарастить силу!', {
                parse_mode: 'Markdown'
            });
        } else {
            goals = 'maintenance';
            await ctx.reply('⚖️ *Идеально!* Поддержание формы - это умная цель. Я помогу тебе оставаться в отличной форме!', {
                parse_mode: 'Markdown'
            });
        }
    } else {
        // In case they typed their goal instead of using the keyboard
        goals = goalsResponse.message.text;
        await ctx.reply(`Отлично! *${goals}* - это прекрасная цель. Мы будем работать над этим вместе!`, {
            parse_mode: 'Markdown'
        });
    }

    // Ask for preferred language with flag emojis (Russian first)
    const languageKeyboard = new InlineKeyboard()
        .text('🇷🇺 Русский', 'lang_ru')
        .row()
        .text('🇬🇧 English', 'lang_en');

    await ctx.reply('🌐 *Выберите предпочитаемый язык:*\n(По умолчанию: Русский)', {
        parse_mode: 'Markdown',
        reply_markup: languageKeyboard
    });

    const languageResponse = await conversation.wait();
    // Default to Russian unless specifically selected English
    let language = 'ru';

    if (languageResponse.callbackQuery) {
        language = languageResponse.callbackQuery.data === 'lang_en' ? 'en' : 'ru';
        // Acknowledge language choice with appropriate language
        if (language === 'en') {
            await ctx.reply('🇬🇧 *English selected!* All future messages will be in English.', {
                parse_mode: 'Markdown'
            });
        } else {
            await ctx.reply('🇷🇺 *Выбран русский язык!* Все будущие сообщения будут на русском.', {
                parse_mode: 'Markdown'
            });
        }
    } else {
        // If they typed, still default to Russian unless explicitly mentioned English
        if (languageResponse.message.text.toLowerCase().includes('english')) {
            language = 'en';
            await ctx.reply('🇬🇧 *English selected!* All future messages will be in English.', {
                parse_mode: 'Markdown'
            });
        } else {
            await ctx.reply('🇷🇺 *Выбран русский язык!* Все будущие сообщения будут на русском.', {
                parse_mode: 'Markdown'
            });
        }
    }

    // Show progress indicator in Russian by default
    const progressText = language === 'en'
        ? '⏳ Creating your personalized fitness profile...'
        : '⏳ Создание вашего персонализированного фитнес-профиля...';
    await ctx.reply(progressText);

    // Save user to database
    const userId = ctx.from.id.toString();
    await userModel.createUser({
        userId,
        name,
        goals,
        language,
        subscription: 'free'
    });

    // Thank the user with appropriate language
    const thankYouText = language === 'en'
        ? `✅ *Profile Created Successfully!*\n\nThank you, ${name}!\n\nYour personalized fitness journey begins now. Use the buttons below to get started.`
        : `✅ *Профиль Успешно Создан!*\n\nСпасибо, ${name}!\n\nВаше персонализированное фитнес-путешествие начинается сейчас. Используйте кнопки ниже, чтобы начать.`;

    // Include more comprehensive button options
    const buttonsText = language === 'en'
        ? ['📱 Open App', '📋 Show Commands', '💪 Start Workout']
        : ['📱 Открыть приложение', '📋 Показать команды', '💪 Начать тренировку'];

    const miniAppKeyboard = new InlineKeyboard()
        .text(buttonsText[0], 'open_app')
        .row()
        .text(buttonsText[1], 'show_commands')
        .row()
        .text(buttonsText[2], 'quick_workout');

    await ctx.reply(thankYouText, {
        parse_mode: 'Markdown',
        reply_markup: miniAppKeyboard
    });

    // Final instructions
    const finalText = language === 'en'
        ? `*Quick Tips:*\n• Use /menu anytime to see main options\n• Use /help if you need assistance\n• Track your workouts for best results!`
        : `*Быстрые Советы:*\n• Используйте /menu в любое время для просмотра основных опций\n• Используйте /help если вам нужна помощь\n• Отслеживайте свои тренировки для получения лучших результатов!`;

    await ctx.reply(finalText, {
        parse_mode: 'Markdown'
    });
}

module.exports = onboardingConversation; 