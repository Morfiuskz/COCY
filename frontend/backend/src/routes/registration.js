// backend/src/routes/registration.js
import express from 'express'
import crypto from 'crypto'
import RegistrationSession from '../models/RegistrationSession.js'
import PlaceRegistration from '../models/PlaceRegistration.js'

const router = express.Router()

// POST /api/registration-sessions
router.post('/registration-sessions', async (req, res) => {
  try {
    const { type, inviterTelegramId, registrantTelegramId } = req.body

    if (!type || !inviterTelegramId) {
      return res
        .status(400)
        .json({ error: 'type and inviterTelegramId are required' })
    }

    const sessionId = crypto.randomUUID()

    const session = await RegistrationSession.create({
      sessionId,
      type,
      inviterTelegramId,
      registrantTelegramId,
      status: 'started'
    })

    return res.status(201).json({ sessionId: session.sessionId })
  } catch (error) {
    console.error('Error creating registration session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/registration-sessions/:sessionId
router.get('/registration-sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const session = await RegistrationSession.findOne({ sessionId })

    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    return res.json({
      sessionId: session.sessionId,
      type: session.type,
      inviterTelegramId: session.inviterTelegramId,
      registrantTelegramId: session.registrantTelegramId,
      status: session.status
    })
  } catch (error) {
    console.error('Error getting registration session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/place-registrations
router.post('/place-registrations', async (req, res) => {
  try {
    const {
      sessionId,
      placeName,
      venueType,
      seats,
      avgCheck,
      location,
      description,
      contactPersons
    } = req.body

    if (!sessionId || !placeName || !venueType || !avgCheck) {
      return res.status(400).json({ error: 'Required fields are missing' })
    }

    const session = await RegistrationSession.findOne({ sessionId })

    if (!session) {
      return res.status(400).json({ error: 'Invalid session' })
    }

    const registration = await PlaceRegistration.create({
      sessionId,
      inviterTelegramId: session.inviterTelegramId,
      registrantTelegramId: session.registrantTelegramId,
      placeName,
      venueType,
      seats,
      avgCheck,
      location,
      description,
      contactPersons: contactPersons || []
    })

    session.status = 'completed'
    await session.save()

    return res.status(201).json(registration)
  } catch (error) {
    console.error('Error creating place registration:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router