require('dotenv').config();
const bot = require('../bot');
const { adminUtils } = require('../utils');

async function testAdminFeatures() {
    try {
        console.log('Testing admin features...');

        // Test admin group ID
        const adminGroupId = process.env.ADMIN_GROUP_ID;
        if (!adminGroupId) {
            throw new Error('ADMIN_GROUP_ID not set in environment variables');
        }
        console.log(`Admin group ID: ${adminGroupId}`);

        // Test sending direct message to admin group
        console.log('Sending test message to admin group...');
        await bot.api.sendMessage(adminGroupId, '🧪 Test message from admin features test script');
        console.log('Direct message sent successfully');

        // Test admin utility functions
        console.log('Testing adminUtils.sendAdminMessage...');
        const result = await adminUtils.sendAdminMessage('📝 Test message sent using adminUtils');
        console.log('adminUtils.sendAdminMessage result:', result ? 'Success' : 'Failed');

        // Test reporting a new user
        console.log('Testing adminUtils.reportNewUser...');
        const mockUser = {
            userId: '12345678',
            name: 'Test User',
            language: 'en',
            goals: 'Lose weight',
            subscription: 'free'
        };
        await adminUtils.reportNewUser(mockUser);
        console.log('New user report sent');

        // Test reporting a subscription
        console.log('Testing adminUtils.reportSubscription...');
        await adminUtils.reportSubscription(mockUser, 'premium');
        console.log('Subscription report sent');

        // Test forwarding a support message
        console.log('Testing adminUtils.forwardSupportMessage...');
        const supportData = {
            userId: '12345678',
            name: 'Test User',
            username: 'testuser',
            message: 'This is a test support message',
            language: 'en'
        };
        await adminUtils.forwardSupportMessage(supportData);
        console.log('Support message forwarded');

        // Test reporting an individual plan
        console.log('Testing adminUtils.reportIndividualPlan...');
        const planData = {
            goals: 'Build muscle and improve endurance',
            height: 180,
            weight: 75,
            fitnessLevel: 'Intermediate',
            healthIssues: 'None',
            preferredWorkoutDays: ['Monday', 'Wednesday', 'Friday'],
            preferredWorkoutTime: 'Evening'
        };
        await adminUtils.reportIndividualPlan(mockUser, planData);
        console.log('Individual plan report sent');

        console.log('All admin feature tests completed successfully!');
    } catch (error) {
        console.error('Error during admin features test:', error);
    } finally {
        process.exit(0);
    }
}

testAdminFeatures(); 