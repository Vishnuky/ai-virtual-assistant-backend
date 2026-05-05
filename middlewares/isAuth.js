import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  try {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)

    const token = req.cookies?.token
    console.log('Token from cookie:', token)

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ FIXED: match payload from signup
    req.userId = decoded.id

    next()

  } catch (error) {
    console.log('verifyToken error:', error.message)

    return res.status(401).json({
      message: "Unauthorized: Invalid token"
    })
  }
}

export default verifyToken
