// src/index.ts
import dotenv from 'dotenv';
import axios from 'axios';

// Загружаем переменные окружения
dotenv.config();

// Интерфейс для типизации конфигурации
interface Config {
  apiToken: string;
  nodeEnv: string;
}

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


class BotClient {
  private apiToken: string;
  private baseURL: string;

  constructor(apiToken: string,
              baseURL: string = 'https://platform-api.max.ru') {
    this.apiToken = apiToken;
    this.baseURL = baseURL;
  }

  // GET запрос
  async getMe(): Promise<JSON[]> {
    try {
      const response = await axios.get<JSON[]>(`${this.baseURL}/me`, {
        headers: {
          'Authorization': this.apiToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}

// Основная функция
async function main() {
  const config = getConfig();

  const bot = new BotClient(
    config.apiToken
  );

  try {
    // Получаем информацию о боте
    console.log('[INFO] Get me...');
    const me = await bot.getMe();
    console.log(me);
  } catch (error) {
    console.error('[ERROR] ', error);
  }
}

// Запуск скрипта
main();