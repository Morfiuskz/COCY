# Compliment Chef Bot

Telegram бот для регистрации заведений через Telegram Mini App.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

3. Заполните переменные окружения в `.env`:
- `BOT_TOKEN` - токен бота от @BotFather
- `BACKEND_API_URL` - URL backend API (по умолчанию: http://localhost:4000)
- `FRONTEND_URL` - URL фронтенда (Telegram Mini App)

## Запуск

```bash
npm run dev
```

## Функционал

Бот обрабатывает команду `/start` с параметром `place_<inviterTelegramId>`:
- Создаёт сессию регистрации на backend
- Отправляет пользователю WebApp кнопку для перехода к форме регистрации

## Структура

```
bot/
├── src/
│   └── bot.js          # Основной файл бота
├── .env.example        # Пример переменных окружения
├── package.json        # Зависимости и скрипты
└── README.md           # Документация
```



