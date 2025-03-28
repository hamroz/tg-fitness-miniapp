require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;
let db;

async function connectToDatabase() {
    if (db) return db;

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('MongoDB URI:', process.env.MONGODB_URI);

    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');

        db = client.db(process.env.MONGODB_DB_NAME || 'fitness_bot');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
}

async function closeConnection() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

module.exports = {
    connectToDatabase,
    closeConnection
}; 