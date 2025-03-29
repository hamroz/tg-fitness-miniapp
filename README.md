# Fitness Trainer Telegram Bot

A Telegram bot that helps users track their fitness goals and provides personalized workouts.

## Features

- User onboarding with name, fitness goals, and language preferences
- Support for both Russian and English
- Integration with mini app (coming soon)
- User data storage in MongoDB

## Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB instance
   - Telegram bot token (from BotFather)

2. **Installation**
   ```bash
   # Clone this repository
   git clone <repository-url>
   cd fitness-mini-app-3

   # Install dependencies
   npm install
   ```

3. **Configuration**
   Create a `.env` file in the root directory with the following content:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/fitness_bot
   MONGODB_DB_NAME=fitness_bot
   MINI_APP_URL=https://your-mini-app.com
   ```

4. **Start the bot**
   ```bash
   node src/index.js
   ```

## Bot Commands

- `/start` - Start the bot
- `/help` - Show help information
- `/subscribe` - Show subscription options
- `/support` - Contact support

## Development

To set up the bot commands in Telegram, send the following to BotFather:

```
start - Start the bot
help - Show help info
subscribe - Show subscription options
support - Contact support
```

## License
Fully written & maintained by [Hamroz G.](https://github.com/hamroz)