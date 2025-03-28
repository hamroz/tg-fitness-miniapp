const cron = require('node-cron');
const dayjs = require('dayjs');
const User = require('../models/User');

class NotificationScheduler {
    constructor(bot, db) {
        this.bot = bot;
        this.userModel = new User(db);
        this.scheduledJobs = new Map();
    }

    /**
     * Initialize all notification jobs
     */
    initializeScheduler() {
        this.scheduleWorkoutReminders();
        this.scheduleWeeklyProgress();
        this.scheduleSubscriptionReminders();

        console.log('Notification scheduler initialized');
    }

    /**
     * Schedule daily workout reminders
     * Runs at 8:00 AM, 12:00 PM, and 6:00 PM
     */
    scheduleWorkoutReminders() {
        // Morning reminder at 8:00 AM
        this.scheduledJobs.set('morning-reminder', cron.schedule('0 8 * * *', () => {
            this.sendWorkoutReminders('morning');
        }));

        // Afternoon reminder at 12:00 PM
        this.scheduledJobs.set('afternoon-reminder', cron.schedule('0 12 * * *', () => {
            this.sendWorkoutReminders('afternoon');
        }));

        // Evening reminder at 6:00 PM
        this.scheduledJobs.set('evening-reminder', cron.schedule('0 18 * * *', () => {
            this.sendWorkoutReminders('evening');
        }));

        console.log('Workout reminders scheduled');
    }

    /**
     * Schedule weekly progress reports
     * Runs on Monday at 10:00 AM
     */
    scheduleWeeklyProgress() {
        this.scheduledJobs.set('weekly-progress', cron.schedule('0 10 * * 1', () => {
            this.sendWeeklyProgress();
        }));

        console.log('Weekly progress reports scheduled');
    }

    /**
     * Schedule subscription expiry reminders
     * Runs every day at 9:00 AM
     */
    scheduleSubscriptionReminders() {
        this.scheduledJobs.set('subscription-reminder', cron.schedule('0 9 * * *', () => {
            this.sendSubscriptionReminders();
        }));

        console.log('Subscription reminders scheduled');
    }

    /**
     * Send workout reminders to users based on their preferred time
     * @param {string} timeOfDay - The time of day (morning, afternoon, evening)
     */
    async sendWorkoutReminders(timeOfDay) {
        try {
            // Query users who have workouts scheduled for this time of day
            const users = await this.userModel.getUsersByWorkoutTime(timeOfDay);

            if (!users || users.length === 0) {
                console.log(`No users found for ${timeOfDay} workout reminders`);
                return;
            }

            console.log(`Sending ${timeOfDay} workout reminders to ${users.length} users`);

            // Send message to each user
            for (const user of users) {
                const message = this.getWorkoutReminderMessage(user, timeOfDay);
                await this.bot.api.sendMessage(user.userId, message, { parse_mode: 'Markdown' });
            }
        } catch (error) {
            console.error(`Error sending ${timeOfDay} workout reminders:`, error);
        }
    }

    /**
     * Generate workout reminder message based on user language and preferences
     * @param {Object} user - User data
     * @param {string} timeOfDay - Time of day
     * @returns {string} - Formatted message
     */
    getWorkoutReminderMessage(user, timeOfDay) {
        const isRussian = user.language === 'ru';

        // Default message in Russian or English based on user preference
        if (isRussian) {
            return `🏋️ *Пора тренироваться!*\n\nПривет, ${user.name}! Время для твоей ${this.getTimeOfDayInRussian(timeOfDay)} тренировки. Не забудь записать свой прогресс в приложении после завершения.`;
        } else {
            return `🏋️ *Time to work out!*\n\nHey ${user.name}! It's time for your ${timeOfDay} workout. Remember to log your progress in the app when you're done.`;
        }
    }

    /**
     * Get time of day in Russian
     * @param {string} timeOfDay - Time of day in English
     * @returns {string} - Time of day in Russian
     */
    getTimeOfDayInRussian(timeOfDay) {
        switch (timeOfDay) {
            case 'morning':
                return 'утренней';
            case 'afternoon':
                return 'дневной';
            case 'evening':
                return 'вечерней';
            default:
                return '';
        }
    }

    /**
     * Send weekly progress reports to users
     */
    async sendWeeklyProgress() {
        try {
            // Get all active users
            const users = await this.userModel.getAllActiveUsers();

            if (!users || users.length === 0) {
                console.log('No active users found for weekly progress reports');
                return;
            }

            console.log(`Sending weekly progress reports to ${users.length} users`);

            // Get current date range (last week)
            const endDate = dayjs().subtract(1, 'day').endOf('day');
            const startDate = endDate.subtract(6, 'day').startOf('day');

            // Format dates for display
            const dateRange = `${startDate.format('DD.MM')} - ${endDate.format('DD.MM.YYYY')}`;

            // Send report to each user
            for (const user of users) {
                try {
                    // Get user's workout data for the past week
                    const workouts = await this.userModel.getUserWorkouts(user.userId, startDate.toDate(), endDate.toDate());

                    // Generate and send the report
                    const message = this.generateProgressReport(user, workouts, dateRange);
                    await this.bot.api.sendMessage(user.userId, message, { parse_mode: 'Markdown' });
                } catch (error) {
                    console.error(`Error sending progress report to user ${user.userId}:`, error);
                }
            }
        } catch (error) {
            console.error('Error sending weekly progress reports:', error);
        }
    }

    /**
     * Generate a weekly progress report
     * @param {Object} user - User data
     * @param {Array} workouts - User's workouts for the week
     * @param {string} dateRange - Date range string
     * @returns {string} - Formatted report
     */
    generateProgressReport(user, workouts, dateRange) {
        const isRussian = user.language === 'ru';

        if (workouts.length === 0) {
            // No workouts message
            if (isRussian) {
                return `📊 *Еженедельный отчет о прогрессе*\n\nПривет, ${user.name}!\n\nЗа период ${dateRange} у вас не было записанных тренировок. Начните тренироваться сегодня!`;
            } else {
                return `📊 *Weekly Progress Report*\n\nHey ${user.name}!\n\nYou didn't log any workouts for the period ${dateRange}. Start working out today!`;
            }
        }

        // Calculate stats
        const totalWorkouts = workouts.length;
        const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises ? w.exercises.length : 1), 0);
        const totalTimeMinutes = Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / 60);

        // Generate message
        if (isRussian) {
            return `📊 *Еженедельный отчет о прогрессе*\n\nПривет, ${user.name}!\n\nВот ваш прогресс за ${dateRange}:\n\n` +
                `• Тренировок: ${totalWorkouts}\n` +
                `• Упражнений: ${totalExercises}\n` +
                `• Общее время: ${totalTimeMinutes} минут\n\n` +
                `Отличная работа! Продолжайте в том же духе. 💪`;
        } else {
            return `📊 *Weekly Progress Report*\n\nHey ${user.name}!\n\nHere's your progress for ${dateRange}:\n\n` +
                `• Workouts: ${totalWorkouts}\n` +
                `• Exercises: ${totalExercises}\n` +
                `• Total time: ${totalTimeMinutes} minutes\n\n` +
                `Great job! Keep up the good work. 💪`;
        }
    }

    /**
     * Send subscription expiry reminders
     */
    async sendSubscriptionReminders() {
        try {
            // Get users whose subscriptions expire in the next 3 days
            const upcomingExpiry = await this.userModel.getUsersWithExpiringSubscriptions(3);

            if (upcomingExpiry && upcomingExpiry.length > 0) {
                console.log(`Sending subscription reminders to ${upcomingExpiry.length} users`);

                for (const user of upcomingExpiry) {
                    const daysLeft = Math.ceil((new Date(user.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    const message = this.getSubscriptionReminderMessage(user, daysLeft);

                    await this.bot.api.sendMessage(user.userId, message, {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: user.language === 'ru' ? 'Продлить подписку' : 'Renew Subscription', web_app: { url: `${process.env.MINI_APP_URL}/subscription` } }]
                            ]
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error sending subscription reminders:', error);
        }
    }

    /**
     * Generate subscription reminder message
     * @param {Object} user - User data
     * @param {number} daysLeft - Days until subscription expires
     * @returns {string} - Formatted message
     */
    getSubscriptionReminderMessage(user, daysLeft) {
        const isRussian = user.language === 'ru';
        const expiryDate = dayjs(user.expiryDate).format('DD.MM.YYYY');

        if (isRussian) {
            return `⚠️ *Напоминание о подписке*\n\nПривет, ${user.name}!\n\nВаша подписка ${user.subscription.toUpperCase()} истекает через ${daysLeft} ${this.getDaysWord(daysLeft, isRussian)} (${expiryDate}).\n\nНажмите кнопку ниже, чтобы продлить подписку и продолжать пользоваться всеми премиум-функциями.`;
        } else {
            return `⚠️ *Subscription Reminder*\n\nHey ${user.name}!\n\nYour ${user.subscription.toUpperCase()} subscription expires in ${daysLeft} ${this.getDaysWord(daysLeft, isRussian)} (${expiryDate}).\n\nClick the button below to renew your subscription and continue enjoying all premium features.`;
        }
    }

    /**
     * Get the correct word form for days in Russian or English
     * @param {number} days - Number of days
     * @param {boolean} isRussian - Whether to use Russian or English
     * @returns {string} - Correct word form
     */
    getDaysWord(days, isRussian) {
        if (!isRussian) {
            return days === 1 ? 'day' : 'days';
        }

        // Russian declension for days
        if (days % 10 === 1 && days % 100 !== 11) {
            return 'день';
        } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
            return 'дня';
        } else {
            return 'дней';
        }
    }

    /**
     * Stop all scheduled jobs
     */
    stopAll() {
        for (const [name, job] of this.scheduledJobs.entries()) {
            console.log(`Stopping scheduled job: ${name}`);
            job.stop();
        }

        this.scheduledJobs.clear();
        console.log('All scheduled jobs stopped');
    }
}

module.exports = NotificationScheduler; 