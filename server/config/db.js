import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Inquiry from '../models/Inquiry.js'
import Testimonial from '../models/Testimonial.js'
import Setting from '../models/Setting.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/evervalerealty')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    await seedData()
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export const seedData = async () => {
  try {
    // 1. Seed User
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash('evervale2026', salt)
      await User.create({
        username: 'admin',
        passwordHash
      })
      console.log('Seeded default admin user: admin / evervale2026')
    }

    // 2. Seed Contact Settings
    const settingCount = await Setting.countDocuments({ key: 'contact_settings' })
    if (settingCount === 0) {
      await Setting.create({
        key: 'contact_settings',
        value: {
          address: 'Evervale Realty LLP, Tirupati & Srikalahasti, Andhra Pradesh, India',
          phone: '+91 98765 43210',
          email: 'contact@evervalerealty.com',
          linkedin: 'https://linkedin.com/company/evervalerealty',
          instagram: 'https://instagram.com/evervalerealty',
          twitter: 'https://twitter.com/evervalerealty',
          facebook: 'https://facebook.com/evervalerealty'
        }
      })
      console.log('Seeded default contact settings')
    }

    // 3. Seed Testimonials
    const testimonialCount = await Testimonial.countDocuments()
    if (testimonialCount === 0) {
      await Testimonial.create([
        {
          quote: 'I had been confused about where to invest for years. Every agent I spoke to gave me a different answer. One conversation with Evervale Realty changed everything. They told me exactly where to buy, why it would grow, and what to watch out for. Today my land has appreciated and I have zero regrets. These are the only people I will ever trust with land.',
          name: 'A. Ramachandra',
          role: 'Government Employee, Tirupati'
        },
        {
          quote: 'Purchasing farmland was a major decision for my retirement. Evervale Realty helped me secure Mayuri Farmlands with my own Pattadhar Passbook. The drip irrigation setup was ready from day one. Complete peace of mind.',
          name: 'K. Srinivasa Rao',
          role: 'Retired School Teacher, Nellore'
        },
        {
          quote: 'The legal clarity Evervale Realty provides is unmatched. They verified the TUDA approvals for my plot in Srikalahasti and guided me through immediate registration. Highly transparent pricing.',
          name: 'P. Lakshmi Priya',
          role: 'Software Engineer, Hyderabad'
        }
      ])
      console.log('Seeded default testimonials')
    }

    // 4. Seed Inquiries
    const inquiryCount = await Inquiry.countDocuments()
    if (inquiryCount === 0) {
      await Inquiry.create([
        {
          id: 'lead-1',
          name: 'A. Ramachandra',
          email: 'ramachandra@example.com',
          phone: '+91 94401 23456',
          contact: 'Phone',
          preferredTime: '10:00',
          message: 'Interested in Plot 1 in Suchithra Gardens, Srikalahasti. Please contact me regarding pricing and registration details.'
        },
        {
          id: 'lead-2',
          name: 'P. Lakshmi Priya',
          email: 'lakshmi.priya@example.com',
          phone: '+91 98480 12345',
          contact: 'Email',
          preferredTime: '15:00',
          message: 'I would like to enquire about the availability of farmland plots in Mayuri Farmlands, Tirupati.'
        }
      ])
      console.log('Seeded default inquiries')
    }

    // Project listings are managed through the admin API, not seeded on startup.
  } catch (error) {
    console.error(`Error seeding default database records: ${error.message}`)
  }
}
