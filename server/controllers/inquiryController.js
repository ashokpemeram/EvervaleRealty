import Inquiry from '../models/Inquiry.js'

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 })
    res.json(inquiries)
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  const { id, name, email, phone, contact, message } = req.body

  try {
    const inquiry = new Inquiry({
      id: id || `lead-${Date.now()}`,
      name,
      email,
      phone,
      contact,
      message
    })

    const createdInquiry = await inquiry.save()
    res.status(201).json(createdInquiry)
  } catch (error) {
    res.status(400).json({ message: 'Invalid inquiry data: ' + error.message })
  }
}

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ id: req.params.id })

    if (inquiry) {
      await Inquiry.deleteOne({ id: req.params.id })
      res.json({ message: 'Inquiry lead dismissed successfully.' })
    } else {
      res.status(404).json({ message: 'Inquiry lead not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
