import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
const MAX_UPLOAD_SIZE = 25 * 1024 * 1024

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'application/pdf'
])

const upload = multer({
  // Files are only held while they are streamed to Cloudinary; nothing is written
  // to the application filesystem, which is ephemeral in production.
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter(req, file, cb) {
    if (allowedMimeTypes.has(file.mimetype)) {
      return cb(null, true)
    }

    cb(new Error('Only JPG, PNG, WEBP, MP4, MOV, AVI, MKV, and PDF files are allowed.'))
  }
})

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const error = new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.')
    error.statusCode = 503
    throw error
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  })

  return cloudinary
}

const resourceTypeFor = (file) => {
  if (file.mimetype.startsWith('video/')) return 'video'
  if (file.mimetype === 'application/pdf') return 'raw'
  return 'image'
}

const uploadToCloudinary = (file) => new Promise((resolve, reject) => {
  const resourceType = resourceTypeFor(file)
  const client = configureCloudinary()
  const stream = client.uploader.upload_stream(
    {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'evervale-realty',
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    },
    (error, result) => {
      if (error) return reject(error)
      resolve(result)
    }
  )

  stream.end(file.buffer)
})

const serializeUpload = (uploadResult) => ({
  url: uploadResult.secure_url,
  publicId: uploadResult.public_id,
  resourceType: uploadResult.resource_type
})

// Upload one cover image, layout image, brochure, or video file to Cloudinary.
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }

  try {
    const result = await uploadToCloudinary(req.file)
    res.status(201).json(serializeUpload(result))
  } catch (error) {
    next(error)
  }
})

// Upload gallery images or multiple project videos to Cloudinary.
router.post('/multiple', protect, upload.array('files', 15), async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' })
  }

  try {
    const results = await Promise.all(req.files.map(uploadToCloudinary))
    res.status(201).json({ urls: results.map((result) => result.secure_url) })
  } catch (error) {
    next(error)
  }
})

export default router
