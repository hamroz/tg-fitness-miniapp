const { adminUtils } = require('../utils');

/**
 * Support handler for the fitness bot
 * Manages user support requests and forwards them to admins
 */
class SupportHandler {
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Initialize support command and handlers
     */
    init() {
        // Register support command
        this.bot.command('support', this.handleSupportCommand.bind(this));

        // Listen for messages in support mode
        this.bot.on('message', this.handlePotentialSupportMessage.bind(this));

        console.log('Support handler initialized');
    }

    /**
     * Handle /support command
     * @param {Object} ctx - Telegram context
     */
    async handleSupportCommand(ctx) {
        try {
            const userId = ctx.from.id;
            const isRussian = ctx.from.language_code === 'ru';

            // Set user state to support mode
            ctx.session.mode = 'support';

            // Send instructions message
            const message = isRussian
                ? '📣 *Поддержка*\n\nОпишите вашу проблему или вопрос, и мы ответим вам как можно скорее.\n\nНапишите /cancel, чтобы выйти из режима поддержки.'
                : '📣 *Support*\n\nDescribe your issue or question, and we will get back to you as soon as possible.\n\nType /cancel to exit support mode.';

            await ctx.reply(message, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('Error handling support command:', error);
            await ctx.reply('Sorry, an error occurred while processing your request. Please try again later.');
        }
    }

    /**
     * Handle messages when user is in support mode
     * @param {Object} ctx - Telegram context
     * @param {Function} next - Next middleware
     */
    async handlePotentialSupportMessage(ctx, next) {
        try {
            // If not in support mode or this is a command, pass to next handler
            if (ctx.session.mode !== 'support' || ctx.message.text?.startsWith('/')) {
                return next();
            }

            const userId = ctx.from.id;
            const message = ctx.message.text || 'Non-text message';
            const username = ctx.from.username || 'No username';
            const name = `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`.trim() || 'Unknown';
            const isRussian = ctx.from.language_code === 'ru';

            // Forward message to admin group
            await adminUtils.forwardSupportMessage({
                userId,
                username,
                name,
                message,
                language: isRussian ? 'ru' : 'en'
            });

            // Send confirmation to user
            const confirmationMsg = isRussian
                ? '✅ Ваше сообщение отправлено команде поддержки. Мы ответим вам как можно скорее.\n\nНапишите /cancel, чтобы выйти из режима поддержки.'
                : '✅ Your message has been sent to our support team. We will get back to you as soon as possible.\n\nType /cancel to exit support mode.';

            await ctx.reply(confirmationMsg);
        } catch (error) {
            console.error('Error handling support message:', error);

            // Error message
            const errorMsg = ctx.from.language_code === 'ru'
                ? '❌ Произошла ошибка при отправке вашего сообщения. Пожалуйста, попробуйте позже.'
                : '❌ An error occurred while sending your message. Please try again later.';

            await ctx.reply(errorMsg);
        }
    }

    /**
     * Handle /cancel command to exit support mode
     * @param {Object} ctx - Telegram context
     */
    async handleCancelCommand(ctx) {
        try {
            if (ctx.session.mode === 'support') {
                // Clear mode
                ctx.session.mode = null;

                // Send confirmation
                const isRussian = ctx.from.language_code === 'ru';
                const message = isRussian
                    ? '✅ Вы вышли из режима поддержки.'
                    : '✅ You have exited support mode.';

                await ctx.reply(message);
            }
        } catch (error) {
            console.error('Error handling cancel command:', error);
        }
    }

    /**
     * Reply to a user from admin group
     * @param {Object} ctx - Telegram context
     * @param {number} userId - User ID to reply to
     * @param {string} message - Reply message text
     */
    async replyToUser(ctx, userId, message) {
        try {
            // Format admin reply
            const adminReply = '👨‍💼 *Support Team Reply*:\n\n' + message;

            // Send message to user
            await this.bot.api.sendMessage(userId, adminReply, { parse_mode: 'Markdown' });

            // Confirm to admin
            await ctx.reply(`✅ Reply sent to user ${userId}`);
        } catch (error) {
            console.error(`Error replying to user ${userId}:`, error);
            await ctx.reply(`❌ Failed to send reply to user ${userId}: ${error.message}`);
        }
    }
}

module.exports = SupportHandler; 