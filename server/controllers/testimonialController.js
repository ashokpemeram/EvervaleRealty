import Testimonial from '../models/Testimonial.js'

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
    res.json(testimonials)
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  const { quote, name, role } = req.body

  try {
    const testimonial = new Testimonial({
      quote,
      name,
      role
    })

    const createdTestimonial = await testimonial.save()
    res.status(201).json(createdTestimonial)
  } catch (error) {
    res.status(400).json({ message: 'Invalid testimonial data: ' + error.message })
  }
}

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)

    if (testimonial) {
      await Testimonial.deleteOne({ _id: req.params.id })
      res.json({ message: 'Testimonial deleted successfully.' })
    } else {
      res.status(404).json({ message: 'Testimonial not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
