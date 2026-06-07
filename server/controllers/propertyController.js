import Property from '../models/Property.js'

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
    res.json(properties)
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Get a property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (property) {
      res.json(property)
    } else {
      res.status(404).json({ message: 'Property listing not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = async (req, res) => {
  const { name, location, price, tag, image, images, videos, brochureUrl, layoutImage, details, plots, showOnHome } = req.body

  try {
    // Check if property name already exists
    const propertyExists = await Property.findOne({ name })
    if (propertyExists) {
      return res.status(400).json({ message: 'A property listing with this name already exists.' })
    }

    const property = new Property({
      name,
      location,
      price,
      tag,
      image,
      images: images || [],
      videos: videos || [],
      brochureUrl: brochureUrl || '',
      layoutImage: layoutImage || '',
      details,
      plots: plots || [],
      showOnHome: showOnHome === true
    })

    const createdProperty = await property.save()
    res.status(201).json(createdProperty)
  } catch (error) {
    res.status(400).json({ message: 'Invalid listing data: ' + error.message })
  }
}

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = async (req, res) => {
  const { name, location, price, tag, image, images, videos, brochureUrl, layoutImage, details, plots, showOnHome } = req.body

  try {
    const property = await Property.findById(req.params.id)

    if (property) {
      property.name = name || property.name
      property.location = location || property.location
      property.price = price || property.price
      property.tag = tag || property.tag
      property.image = image || property.image
      property.images = images !== undefined ? images : property.images
      property.videos = videos !== undefined ? videos : property.videos
      property.brochureUrl = brochureUrl !== undefined ? brochureUrl : property.brochureUrl
      property.layoutImage = layoutImage !== undefined ? layoutImage : property.layoutImage
      property.details = details || property.details
      property.showOnHome = showOnHome !== undefined ? showOnHome : property.showOnHome
      if (plots) {
        property.plots = plots
      }

      const updatedProperty = await property.save()
      res.json(updatedProperty)
    } else {
      res.status(404).json({ message: 'Property listing not found.' })
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid listing data: ' + error.message })
  }
}

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (property) {
      await Property.deleteOne({ _id: req.params.id })
      res.json({ message: 'Property listing deleted successfully.' })
    } else {
      res.status(404).json({ message: 'Property listing not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// @desc    Update a specific plot status
// @route   PUT /api/properties/:propertyId/plots/:plotId/status
// @access  Public
export const updatePlotStatus = async (req, res) => {
  const { status } = req.body

  try {
    const property = await Property.findById(req.params.propertyId)

    if (property) {
      const plot = property.plots.find((p) => p.id === req.params.plotId)

      if (plot) {
        plot.status = status || plot.status
        await property.save()
        res.json({ message: 'Plot status updated successfully', plot })
      } else {
        res.status(404).json({ message: 'Plot not found in this venture.' })
      }
    } else {
      res.status(404).json({ message: 'Venture property not found.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
