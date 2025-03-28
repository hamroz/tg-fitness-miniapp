const { InlineKeyboard } = require('grammy');

/**
 * Onboarding conversation to collect user information
 * @param {Object} conversation - The conversation context
 * @param {Object} ctx - The bot context
 * @param {Object} userModel - The user model for database operations
 */
async function onboardingConversation(conversation, ctx, userModel) {
    // Initial greeting
    await ctx.reply('Привет! Я твой фитнес-тренер в Telegram!');

    // Ask for name
    await ctx.reply('Как тебя зовут?');
    const nameResponse = await conversation.wait();
    const name = nameResponse.message.text;

    // Ask for fitness goals
    const goalsKeyboard = new InlineKeyboard()
        .text('Похудение', 'goal_weight_loss')
        .row()
        .text('Набор мышечной массы', 'goal_muscle_gain')
        .row()
        .text('Поддержание формы', 'goal_maintenance');

    await ctx.reply('Какая у тебя цель?', {
        reply_markup: goalsKeyboard
    });

    const goalsResponse = await conversation.wait();
    let goals;

    if (goalsResponse.callbackQuery) {
        const data = goalsResponse.callbackQuery.data;
        if (data === 'goal_weight_loss') {
            goals = 'weight_loss';
            await ctx.reply('Отлично! Похудение - хорошая цель.');
        } else if (data === 'goal_muscle_gain') {
            goals = 'muscle_gain';
            await ctx.reply('Отлично! Набор мышечной массы - хорошая цель.');
        } else {
            goals = 'maintenance';
            await ctx.reply('Отлично! Поддержание формы - хорошая цель.');
        }
    } else {
        // In case they typed their goal instead of using the keyboard
        goals = goalsResponse.message.text;
        await ctx.reply(`Отлично! ${goals} - хорошая цель.`);
    }

    // Ask for preferred language
    const languageKeyboard = new InlineKeyboard()
        .text('Русский', 'lang_ru')
        .row()
        .text('English', 'lang_en');

    await ctx.reply('Выберите язык / Choose language:', {
        reply_markup: languageKeyboard
    });

    const languageResponse = await conversation.wait();
    let language;

    if (languageResponse.callbackQuery) {
        language = languageResponse.callbackQuery.data === 'lang_en' ? 'en' : 'ru';
    } else {
        // Default to Russian if they typed something
        language = languageResponse.message.text.toLowerCase().includes('english') ? 'en' : 'ru';
    }

    // Save user to database
    const userId = ctx.from.id.toString();
    await userModel.createUser({
        userId,
        name,
        goals,
        language,
        subscription: 'free'
    });

    // Thank the user
    const thankYouText = language === 'en'
        ? `Thank you, ${name}! Your profile has been created.`
        : `Спасибо, ${name}! Ваш профиль создан.`;

    // Include mini app button
    const appButtonText = language === 'en' ? 'Open App' : 'Открыть приложение';
    const miniAppKeyboard = new InlineKeyboard()
        .text(appButtonText, 'open_app');

    await ctx.reply(thankYouText, {
        reply_markup: miniAppKeyboard
    });
}

module.exports = onboardingConversation; 