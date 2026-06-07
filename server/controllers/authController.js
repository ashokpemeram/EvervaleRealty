import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'evervale_super_secret_key_2026', {
    expiresIn: '30d'
  })
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body

  try {
    // Check for user
    const user = await User.findOne({ username })

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({ message: 'Invalid administrative credentials.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
