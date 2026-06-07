import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import uploadRoutes from './routes/uploadRoutes.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB Database
connectDB()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Route Registrations
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/contact-settings', settingsRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Evervale Realty Backend is healthy' })
})

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error: ' + err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
