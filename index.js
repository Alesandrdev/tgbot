const TelegramApi = require('node-telegram-bot-api');
const sequelize = require('./db.js');
const UserModel = require('./models.js');
const token = '6114604605:AAFsH8pap7OUdHh6XMa-dXNU7nyoKWK85x8';
const bot = new TelegramApi(token, {polling: true});
const chats = {};
const {gameOptions, againOptions} = require('./options');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Now, i guess number from 0 to 9, you must guess it's number");
    chats[chatId] = Math.floor(Math.random() * 10).toString();
    await bot.sendMessage(chatId, 'can you guess?', gameOptions)
}

const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log(`connecting to db is broken ${e}`)
    }

    await bot.setMyCommands([
        {command: '/start', description: 'starting notice'},
        {command: '/info', description: 'give the information about user'},
        {command: '/game', description: 'start the game'},
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {

            if (text === '/start') {
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/2.webp')
                return bot.sendMessage(chatId, `welcome`);
            }

            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `your name ${msg.from.first_name} ${msg.from.last_name}, 
                in game you have right answers ${user.right} wrong answers ${user.wrong}`)
            }

            if (text === '/game') {
                return startGame(chatId);
            }

            return bot.sendMessage(chatId, "I'm not understand you, try again!")
        } catch (e) {
            return bot.sendMessage(chatId, `was happened error ${e}`)
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        const user = await UserModel.findOne({chatId})
        if (data === chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `you win, you guess number ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `you not guess, it's number ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
}

start()