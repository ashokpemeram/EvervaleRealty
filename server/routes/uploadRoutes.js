import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { protect } from '../middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp|mp4|mkv|mov|avi|pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb(new Error('Only images (jpg, png, webp), videos (mp4, mkv, mov, avi), and PDFs are allowed!'))
    }
  }
})

// Single file upload endpoint (returns file path url)
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`
  const filePath = `${baseUrl}/uploads/${req.file.filename}`
  res.status(201).json({ url: filePath })
})

// Multiple files upload endpoint (returns array of file path urls)
router.post('/multiple', protect, upload.array('files', 15), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' })
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`
  const urls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`)
  res.status(201).json({ urls })
})

export default router
