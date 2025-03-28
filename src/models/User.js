const { MongoClient } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async createUser(userData) {
        return await this.collection.insertOne({
            userId: userData.userId,
            name: userData.name,
            goals: userData.goals,
            language: userData.language,
            phone: userData.phone || null,
            subscription: userData.subscription || 'free',
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
}

module.exports = User; 