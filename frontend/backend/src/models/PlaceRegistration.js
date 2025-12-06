// backend/src/models/PlaceRegistration.js
import mongoose from 'mongoose'

const contactPersonSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  telegramNick: { type: String, required: true },
  phone: { type: String, required: true }
})

const placeRegistrationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    inviterTelegramId: { type: Number },
    registrantTelegramId: { type: Number },
    placeName: { type: String, required: true },
    venueType: { type: String, required: true },
    seats: { type: String },
    avgCheck: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    contactPersons: { type: [contactPersonSchema], default: [] }
  },
  { timestamps: true }
)

const PlaceRegistration = mongoose.model(
  'PlaceRegistration',
  placeRegistrationSchema
)

export default PlaceRegistration