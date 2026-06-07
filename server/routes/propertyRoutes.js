import express from 'express'
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePlotStatus
} from '../controllers/propertyController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(getProperties)
  .post(protect, createProperty)

router.route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty)

router.route('/:propertyId/plots/:plotId/status')
  .put(updatePlotStatus)

export default router
