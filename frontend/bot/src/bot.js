import { Telegraf } from 'telegraf'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'
const FRONTEND_URL =
  process.env.FRONTEND_URL || 'https://7f25ef132635.ngrok-free.app'

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required in .env')
}

const bot = new Telegraf(BOT_TOKEN)

bot.start(async (ctx) => {
  const payload = (ctx.startPayload || '').trim()
  console.log('➡️ /start from', ctx.from.id, 'payload:', payload || '<empty>')

  // Если payload нет — обычное приветствие
  if (!payload) {
    return ctx.reply(
      '👋 Добро пожаловать в бот "Комплимент от шефа"!\n\n' +
        'Используйте QR-код или ссылку из мини-приложения, чтобы пригласить заведение или гостя.'
    )
  }

  const [kind, inviterIdStr] = payload.split('_')
  const inviterTelegramId = Number(inviterIdStr)
  const registrantTelegramId = ctx.from.id

  // Регистрация заведения: place_<inviterId>
  if (kind === 'place' && Number.isFinite(inviterTelegramId)) {
    try {
      console.log(
        '📨 Creating place registration session:',
        'inviter =',
        inviterTelegramId,
        'registrant =',
        registrantTelegramId
      )

      const res = await axios.post(
        `${BACKEND_URL}/api/registration-sessions`,
        {
          type: 'place',
          inviterTelegramId,
          registrantTelegramId
        }
      )

      const sessionId = res.data.sessionId
      console.log('✅ Session created:', sessionId)

      return ctx.reply(
        'Вас пригласили зарегистрировать заведение.\n' +
          'Нажмите кнопку ниже, чтобы открыть форму регистрации в мини-приложении.',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Открыть форму регистрации',
                  web_app: {
                    url: `${FRONTEND_URL}/?sessionId=${encodeURIComponent(
                      sessionId
                    )}`
                  }
                }
              ]
            ]
          }
        }
      )
    } catch (error) {
      console.error(
        '❌ Error creating registration session:',
        error?.response?.data || error.message
      )
      return ctx.reply(
        '⚠️ Не удалось создать сессию регистрации. Попробуйте позже.'
      )
    }
  }

  // Заглушка для user_<id> — добавим позже
  if (kind === 'user') {
    return ctx.reply(
      'Регистрация пользователя по реферальной ссылке будет добавлена позже.'
    )
  }

  return ctx.reply(
    '⚠️ Неверный или устаревший параметр ссылки. Сгенерируйте новый QR-код в мини-приложении.'
  )
})

// Старт бота
bot.launch().then(() => {
  console.log('🤖 Bot started')
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))