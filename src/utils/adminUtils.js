require('dotenv').config();
const dayjs = require('dayjs');

/**
 * Send a message to the admin group
 * @param {string} message - The message to send
 * @param {Object} options - Additional options for the message
 * @returns {Promise<Object>} - The message response
 */
async function sendAdminMessage(message, options = {}) {
    const adminGroupId = process.env.ADMIN_GROUP_ID;

    if (!adminGroupId) {
        console.error('ADMIN_GROUP_ID not set in environment variables');
        return null;
    }

    try {
        const bot = require('../bot');
        return await bot.api.sendMessage(adminGroupId, message, options);
    } catch (error) {
        console.error('Error sending message to admin group:', error);
        return null;
    }
}

/**
 * Report a new user registration to admin group
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - The message response
 */
async function reportNewUser(userData) {
    const message = `🆕 *New User Registration*\n\n` +
        `*User:* ${userData.name}\n` +
        `*ID:* ${userData.userId}\n` +
        `*Language:* ${userData.language}\n` +
        `*Goals:* ${userData.goals}\n` +
        `*Time:* ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`;

    return await sendAdminMessage(message, { parse_mode: 'Markdown' });
}

/**
 * Report subscription change to admin group
 * @param {Object} userData - User data
 * @param {string} subscription - Subscription type
 * @returns {Promise<Object>} - The message response
 */
async function reportSubscription(userData, subscription) {
    const message = `💰 *New Subscription*\n\n` +
        `*User:* ${userData.name}\n` +
        `*ID:* ${userData.userId}\n` +
        `*Plan:* ${subscription.toUpperCase()}\n` +
        `*Time:* ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`;

    return await sendAdminMessage(message, { parse_mode: 'Markdown' });
}

/**
 * Forward a support message from a user to the admin group
 * @param {Object} userData - User data including userId, username, name, message
 * @returns {Promise<Object>} - The message response
 */
async function forwardSupportMessage(userData) {
    const formattedMessage = `🆘 *Support Request*\n\n` +
        `*User:* ${userData.name}\n` +
        `*ID:* ${userData.userId}\n` +
        (userData.username ? `*Username:* @${userData.username}\n` : '') +
        `*Language:* ${userData.language}\n` +
        `*Time:* ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n` +
        `*Message:*\n${userData.message}`;

    return await sendAdminMessage(formattedMessage, { parse_mode: 'Markdown' });
}

/**
 * Report individual plan request to admin group
 * @param {Object} userData - User data
 * @param {Object} planData - Individual plan data
 * @returns {Promise<Object>} - The message response
 */
async function reportIndividualPlan(userData, planData) {
    const message = `🏋️ *Individual Plan Request*\n\n` +
        `*User:* ${userData.name}\n` +
        `*ID:* ${userData.userId}\n` +
        `*Language:* ${userData.language}\n` +
        `*Time:* ${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n` +
        `*Goals:* ${planData.goals}\n` +
        `*Height:* ${planData.height} cm\n` +
        `*Weight:* ${planData.weight} kg\n` +
        `*Fitness Level:* ${planData.fitnessLevel}\n` +
        `*Health Issues:* ${planData.healthIssues || 'None'}\n` +
        `*Preferred Days:* ${planData.preferredWorkoutDays.join(', ')}\n` +
        `*Preferred Time:* ${planData.preferredWorkoutTime}`;

    return await sendAdminMessage(message, { parse_mode: 'Markdown' });
}

module.exports = {
    sendAdminMessage,
    reportNewUser,
    reportSubscription,
    forwardSupportMessage,
    reportIndividualPlan
}; 