import Setting from '../models/Setting.js'

// @desc    Get contact settings
// @route   GET /api/contact-settings
// @access  Public
export const getContactSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne({ key: 'contact_settings' })
    if (settings) {
      res.json(settings.value)
    } else {
      res.status(404).json({ message: 'Contact settings configuration not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Update contact settings
// @route   PUT /api/contact-settings
// @access  Private/Admin
export const updateContactSettings = async (req, res) => {
  const { address, phone, email, linkedin, instagram, twitter, facebook } = req.body

  try {
    let settings = await Setting.findOne({ key: 'contact_settings' })

    if (settings) {
      settings.value = { address, phone, email, linkedin, instagram, twitter, facebook }
      const updatedSettings = await settings.save()
      res.json(updatedSettings.value)
    } else {
      settings = new Setting({
        key: 'contact_settings',
        value: { address, phone, email, linkedin, instagram, twitter, facebook }
      })
      const createdSettings = await settings.save()
      res.status(201).json(createdSettings.value)
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid settings data: ' + error.message })
  }
}
