import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import registrationRoutes from './routes/registration.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
)

// Подключение к БД
connectDB()

// API Routes
app.use('/api', registrationRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`)
})