const { MongoClient } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
        this.workoutCollection = db.collection('workouts');
    }

    async createUser(userData) {
        return await this.collection.insertOne({
            userId: userData.userId,
            name: userData.name,
            goals: userData.goals,
            language: userData.language,
            phone: userData.phone || null,
            subscription: userData.subscription || 'free',
            subscriptionExpiry: null,
            workoutPreferences: {
                preferredTime: userData.preferredTime || 'evening',
                preferredDays: userData.preferredDays || ['Monday', 'Wednesday', 'Friday'],
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async getUserById(userId) {
        return await this.collection.findOne({ userId });
    }

    async updateUser(userId, updateData) {
        return await this.collection.updateOne(
            { userId },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );
    }

    /**
     * Update user subscription information
     * @param {number|string} userId - User ID
     * @param {string} subscription - Subscription type (free, premium, individual)
     * @param {Date} expiryDate - Subscription expiry date
     * @returns {Promise<Object>} - Update result
     */
    async updateSubscription(userId, subscription, expiryDate) {
        return await this.collection.updateOne(
            { userId },
            {
                $set: {
                    subscription,
                    subscriptionExpiry: expiryDate,
                    updatedAt: new Date()
                }
            }
        );
    }

    /**
     * Get users with expiring subscriptions within the specified days
     * @param {number} days - Number of days before expiry
     * @returns {Promise<Array>} - Array of users
     */
    async getUsersWithExpiringSubscriptions(days) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        return await this.collection.find({
            subscription: { $in: ['premium', 'individual'] },
            subscriptionExpiry: {
                $gte: today,
                $lte: futureDate
            }
        }).toArray();
    }

    /**
     * Get users based on their preferred workout time
     * @param {string} timeOfDay - Time of day (morning, afternoon, evening)
     * @returns {Promise<Array>} - Array of users
     */
    async getUsersByWorkoutTime(timeOfDay) {
        return await this.collection.find({
            'workoutPreferences.preferredTime': timeOfDay
        }).toArray();
    }

    /**
     * Get all active users (interacted within last 30 days)
     * @returns {Promise<Array>} - Array of users
     */
    async getAllActiveUsers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return await this.collection.find({
            $or: [
                { updatedAt: { $gte: thirtyDaysAgo } },
                { createdAt: { $gte: thirtyDaysAgo } }
            ]
        }).toArray();
    }

    /**
     * Get user's workouts within a date range
     * @param {number|string} userId - User ID
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Array>} - Array of workouts
     */
    async getUserWorkouts(userId, startDate, endDate) {
        return await this.workoutCollection.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();
    }
}

module.exports = User; 