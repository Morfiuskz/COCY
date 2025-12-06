import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'

/**
 * Создаёт сессию регистрации заведения на backend
 * @param {number} inviterId - ID пользователя, который пригласил
 * @param {number} registrantId - ID пользователя, который регистрируется
 * @returns {Promise<{sessionId: string}>}
 */
export async function createPlaceSession(inviterId, registrantId) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/registration-sessions`,
      {
        type: 'place',
        inviterTelegramId: inviterId,
        registrantTelegramId: registrantId
      }
    )

    return response.data
  } catch (error) {
    console.error('Error creating place session:', error)
    if (error.response) {
      throw new Error(
        `Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      )
    }
    throw error
  }
}

/**
 * Получает данные регистрации заведения по sessionId
 * @param {string} sessionId - ID сессии регистрации
 * @returns {Promise<Object>}
 */
export async function getPlaceRegistration(sessionId) {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/registration-sessions/${sessionId}`
    )

    return response.data
  } catch (error) {
    console.error('Error getting place registration:', error)
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Session not found')
      }
      throw new Error(
        `Backend error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      )
    }
    throw error
  }
}

