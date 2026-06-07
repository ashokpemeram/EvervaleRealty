import express from 'express'
import {
  getContactSettings,
  updateContactSettings
} from '../controllers/settingsController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(getContactSettings)
  .put(protect, updateContactSettings)

export default router
