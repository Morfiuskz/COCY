import { createPlaceSession } from './registration.js'
import dotenv from 'dotenv'

dotenv.config()

const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173'

/**
 * Обрабатывает команду /start с payload для регистрации заведения
 * @param {Object} ctx - Контекст Telegraf
 * @param {string} payload - Параметр после /start (например, "place_510498010")
 */
export async function handleStartPlace(ctx, payload) {
  try {
    // Извлекаем inviterId из payload (формат: "place_510498010")
    const inviterIdStr = payload.replace('place_', '')
    const inviterId = parseInt(inviterIdStr, 10)

    if (isNaN(inviterId)) {
      return ctx.reply('❌ Неверный формат ссылки приглашения.')
    }

    // Получаем ID регистрирующегося пользователя
    const registrantId = ctx.from.id

    // Создаём сессию через backend
    const { sessionId } = await createPlaceSession(inviterId, registrantId)

    if (!sessionId) {
      return ctx.reply('❌ Ошибка при создании сессии регистрации.')
    }

    // Формируем URL для WebApp
    const webAppUrl = `${WEBAPP_URL}?sessionId=${sessionId}`

    // Отправляем сообщение с WebApp кнопкой
    await ctx.reply(
      '👋 Добро пожаловать!\n\n' +
      'Нажмите на кнопку ниже, чтобы начать регистрацию заведения.',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📝 Зарегистрировать заведение',
                web_app: {
                  url: webAppUrl
                }
              }
            ]
          ]
        }
      }
    )
  } catch (error) {
    console.error('Error in handleStartPlace:', error)
    
    const errorMessage = error.message || 'Произошла ошибка'
    return ctx.reply(
      `❌ Ошибка при создании сессии регистрации: ${errorMessage}\n\nПопробуйте позже.`
    )
  }
}

/**
 * Обрабатывает команду /start без параметров или с неизвестным payload
 * @param {Object} ctx - Контекст Telegraf
 */
export async function handleStartDefault(ctx) {
  await ctx.reply(
    '👋 Добро пожаловать в бот "Комплимент от шефа"!\n\n' +
    'Используйте ссылку-приглашение для регистрации заведения.'
  )
}

