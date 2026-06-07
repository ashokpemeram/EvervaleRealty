import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

const Testimonial = mongoose.model('Testimonial', testimonialSchema)
export default Testimonial
