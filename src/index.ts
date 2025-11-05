import { Bot } from '@maxhub/max-bot-api';
import dotenv from 'dotenv';

// Types
import type { Config } from "./types/config.type";
import { User } from '@maxhub/max-bot-api/types';

// Загружаем переменные окружения
dotenv.config();

// Валидация и получение конфигурации
const getConfig = (): Config => {
  const apiToken = process.env.API_TOKEN;
  
  if (!apiToken) {
    throw new Error('API_TOKEN is required in .env file');
  }

  return {
    apiToken,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
};


const botConfig = getConfig();
const bot = new Bot(botConfig.apiToken); // Токен, полученный при регистрации бота в MAX

// Устанавливает список команд, который пользователь будет видеть в чате с ботом
bot.api.setMyCommands([
  {
    name: 'start',
    description: 'Поприветствовать бота',
  },
]);

// Обработчик команды '/start'
bot.command('start', (ctx) => {
  const user = ctx.user as User | undefined;

  if (user) {
    // Если пользователя не получилось определить, просто поздороваемся 
    return ctx.reply(`Привет, ${user.name}! ✨`);
  }

  // Если пользователя определён, поздороваемся адресно
  return ctx.reply(`Привет! ✨`);
});

bot.start(); // Запускает получение обновлений