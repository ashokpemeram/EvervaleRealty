import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Property from './models/Property.js'
import Inquiry from './models/Inquiry.js'
import Testimonial from './models/Testimonial.js'
import Setting from './models/Setting.js'
import { seedData } from './config/db.js'

// Load environment variables
dotenv.config()

const resetDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/evervalerealty'
    console.log('Connecting to MongoDB for database reset...')
    await mongoose.connect(mongoUri)
    console.log('Connected. Clearing existing collections...')

    // Drop collections to force fresh seed
    const collections = ['users', 'properties', 'inquiries', 'testimonials', 'settings']
    for (const name of collections) {
      try {
        await mongoose.connection.db.dropCollection(name)
        console.log(`Dropped collection: ${name}`)
      } catch (err) {
        // Collection might not exist yet, which is fine
        if (err.codeName === 'NamespaceNotFound' || err.message.includes('ns not found')) {
          console.log(`Collection ${name} does not exist, skipping drop.`)
        } else {
          console.warn(`Could not drop collection ${name}:`, err.message)
        }
      }
    }

    console.log('Running database seeding script...')
    await seedData()
    console.log('Database reset and seed completed successfully!')
  } catch (error) {
    console.error('Error resetting database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  }
}

resetDB()
