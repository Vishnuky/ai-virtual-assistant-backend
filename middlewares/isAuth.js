import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  try {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    const token = req.cookies.token
    console.log('Token from cookie:', !!token)
    if (!token) {
      return res.status(401).json({ message: "unauthorized" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.log('verifyToken error:', error.message)
    return res.status(500).json({ message: "token error" })
  }
}

export default verifyToken