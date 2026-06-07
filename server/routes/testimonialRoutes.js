import express from 'express'
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial)

router.route('/:id')
  .delete(protect, deleteTestimonial)

export default router
