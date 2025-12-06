// backend/src/models/RegistrationSession.js
import mongoose from 'mongoose'

const registrationSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['place', 'user'], required: true },
    inviterTelegramId: { type: Number, required: true },
    registrantTelegramId: { type: Number },
    status: {
      type: String,
      enum: ['started', 'completed'],
      default: 'started'
    }
  },
  { timestamps: true }
)

const RegistrationSession = mongoose.model(
  'RegistrationSession',
  registrationSessionSchema
)

export default RegistrationSession