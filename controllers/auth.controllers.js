import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

// SIGN UP
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if email exists
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" })
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters!" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Generate token (IMPORTANT: use _id key)
    const token = genToken(user._id)

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return res.status(500).json({ message: "Server error during signup" })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Email does not exist!" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    // Generate token
    const token = genToken(user._id)

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ message: "Server error during login" })
  }
}

// LOGOUT (stateless)
export const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ message: "Server error during logout" })
  }
}
