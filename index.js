const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');
const token = '5318467888:AAEFYL39BvKZrYedfZf-V1dbpnRBdMU5oD4';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = String(randomNumber);
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное действие'}, 
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ]);
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if ( text === "/start") {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/44b/0fd/44b0fdfc-56b4-3923-b93b-aa4aec9e8476/192/11.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в умный телеграм бот `);
        };
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        };

        if (text === '/game') {
            return startGame(chatId);
        };

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');

    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        };
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        };
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
    });
};

start();