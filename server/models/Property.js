import mongoose from 'mongoose'

const plotSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  zoning: {
    type: String,
    default: 'Residential Land'
  },
  verification: {
    type: String,
    default: 'Approved'
  }
})

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  details: {
    beds: Number,
    baths: Number,
    area: {
      type: String,
      required: true
    },
    totalPlots: Number
  },
  plots: [plotSchema],
  images: {
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  brochureUrl: {
    type: String,
    default: ''
  },
  layoutImage: {
    type: String,
    default: ''
  },
  showOnHome: {
    type: Boolean,
    default: false
  }
})

const Property = mongoose.model('Property', propertySchema)
export default Property
