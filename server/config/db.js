import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Property from '../models/Property.js'
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

const seedData = async () => {
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
          address: '428 Penthouse Plaza, Art District, NY 10012',
          phone: '+1 (212) 555-0198',
          email: 'concierge@evervale.com',
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
          quote: 'Evervale delivered a rare off-market asset with a closing cadence that felt effortless.',
          name: 'Celia Monroe',
          role: 'Principal Investor'
        },
        {
          quote: 'Their verification process rivals institutional due diligence. We never compromise.',
          name: 'Dylan Park',
          role: 'Private Office Lead'
        },
        {
          quote: 'The team blends modern analytics with a bespoke client experience. Impeccable.',
          name: 'Anika Shah',
          role: 'Portfolio Director'
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
          name: 'Celia Monroe',
          email: 'celia@monroecapital.com',
          phone: '+1 (310) 555-9081',
          contact: 'Private Briefing',
          message: 'I am interested in acquiring Plot 2 at Evervale Oakridge Estates (listed at $465K). Please coordinate a private briefing with my office.'
        },
        {
          id: 'lead-2',
          name: 'Dylan Park',
          email: 'dylan@parkfamilyoffice.com',
          phone: '+1 (212) 555-0012',
          contact: 'Phone',
          message: 'Interested in private off-market listings matching the Contemporary Aspen series.'
        }
      ])
      console.log('Seeded default inquiries')
    }

    // 5. Seed Properties
    const propertyCount = await Property.countDocuments()
    if (propertyCount === 0) {
      await Property.create([
        {
          name: 'Evervale Oakridge Estates',
          location: 'Austin Hills, TX',
          price: 'From $450K',
          tag: 'VENTURE PLOTS',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          images: [
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
          ],
          videos: [
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
          ],
          brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          layoutImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          details: { totalPlots: 8, area: "80' x 120' - 120' x 160'" },
          showOnHome: true,
          plots: [
            {
              id: 'oak-plot-1',
              number: 'Plot 1',
              dimensions: "80' x 120'",
              area: '9,600 sq ft',
              price: '$450K',
              status: 'available',
              x: 100,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-2',
              number: 'Plot 2',
              dimensions: "80' x 120'",
              area: '9,600 sq ft',
              price: '$465K',
              status: 'available',
              x: 190,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-3',
              number: 'Plot 3',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$510K',
              status: 'reserved',
              x: 280,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-4',
              number: 'Plot 4',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$495K',
              status: 'available',
              x: 370,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-5',
              number: 'Plot 5',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$580K',
              status: 'sold',
              x: 100,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-6',
              number: 'Plot 6',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$610K',
              status: 'available',
              x: 190,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-7',
              number: 'Plot 7',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$680K',
              status: 'reserved',
              x: 280,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'oak-plot-8',
              number: 'Plot 8',
              dimensions: "120' x 160'",
              area: '19,200 sq ft',
              price: '$750K',
              status: 'sold',
              x: 370,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            }
          ]
        },
        {
          name: 'Evervale Lakeside Estates',
          location: 'Lake Tahoe, NV',
          price: 'From $590K',
          tag: 'VENTURE PLOTS',
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
          images: [
            'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=1200&q=80'
          ],
          videos: [
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
          ],
          brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          layoutImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          details: { totalPlots: 8, area: "90' x 130' - 130' x 180'" },
          showOnHome: true,
          plots: [
            {
              id: 'lake-plot-1',
              number: 'Plot 1',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$590K',
              status: 'available',
              x: 100,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-2',
              number: 'Plot 2',
              dimensions: "90' x 130'",
              area: '11,700 sq ft',
              price: '$610K',
              status: 'available',
              x: 190,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-3',
              number: 'Plot 3',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$650K',
              status: 'reserved',
              x: 280,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-4',
              number: 'Plot 4',
              dimensions: "100' x 140'",
              area: '14,000 sq ft',
              price: '$630K',
              status: 'available',
              x: 370,
              y: 80,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-5',
              number: 'Plot 5',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$720K',
              status: 'sold',
              x: 100,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-6',
              number: 'Plot 6',
              dimensions: "110' x 150'",
              area: '16,500 sq ft',
              price: '$740K',
              status: 'available',
              x: 190,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-7',
              number: 'Plot 7',
              dimensions: "120' x 160'",
              area: '19,200 sq ft',
              price: '$810K',
              status: 'reserved',
              x: 280,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            },
            {
              id: 'lake-plot-8',
              number: 'Plot 8',
              dimensions: "130' x 180'",
              area: '23,400 sq ft',
              price: '$890K',
              status: 'sold',
              x: 370,
              y: 200,
              width: 80,
              height: 60,
              zoning: 'Residential Land',
              verification: 'Approved'
            }
          ]
        },
        {
          name: 'Summit Glasshouse',
          location: 'Aspen, CO',
          price: '$12.2M',
          tag: 'NEW ACQUISITION',
          image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
          images: [
            'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
          ],
          videos: [
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
          ],
          brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          layoutImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          details: { beds: 6, baths: 7, area: '8,750 sq ft' },
          showOnHome: true
        },
        {
          name: 'Regent Crescent',
          location: 'Tribeca, NY',
          price: '$8.1M',
          tag: 'NEW ACQUISITION',
          image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80',
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          ],
          videos: [
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
          ],
          brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          layoutImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          details: { beds: 3, baths: 4, area: '4,200 sq ft' },
          showOnHome: true
        }
      ])
      console.log('Seeded default properties and land venture plots')
    }
  } catch (error) {
    console.error(`Error seeding default database records: ${error.message}`)
  }
}
