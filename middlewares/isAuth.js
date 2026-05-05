import jwt from "jsonwebtoken"

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user (IMPORTANT: match payload)
    req.user = decoded   // {_id: ...}

    next()

  } catch (err) {
    console.error("JWT error:", err.message)
    return res.status(401).json({ message: "Token invalid or expired" })
  }
}

export default protect
