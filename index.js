const TelegramApi = require('node-telegram-bot-api');

const token = '6114604605:AAFsH8pap7OUdHh6XMa-dXNU7nyoKWK85x8';
const bot = new TelegramApi(token, {polling: true});
const chats = {};
const {gameOptions, againOptions} = require('./options');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Now, i guess number from 0 to 9, you must guess it's number");
    const randomNumber = Math.floor(Math.random() * 10).toString();
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'can you guess?', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg)
        bot.setMyCommands([
            {command: '/start', description: 'starting notice'},
            {command: '/info', description: 'give the information about user'},
            {command: '/game', description: 'start the game'},
        ]);

        if (text === '/start') {

            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/2.webp')
            return  bot.sendMessage(chatId, `welcome`);
        }

        if (text === '/info') {

            return  bot.sendMessage(chatId, `your name ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "I'm not understand you, try again!")
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
          return startGame(chatId);
        }

        if (data === chats[chatId]){
            return await bot.sendMessage(chatId, `you win, you guess number ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `you not guess, it's number ${chats[chatId]}`, againOptions);
        }

    })
}

start()