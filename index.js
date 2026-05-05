import 'dotenv/config'
import express from 'express'
import connectDb from './config/db.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// ✅ Allowed origins (add your deployed frontend here)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-virtual-assistant-ou1m.onrender.com'
]

// ✅ Proper CORS setup
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('CORS not allowed'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// ✅ Handle preflight explicitly (important for Render)
app.options('*', cors())

app.use(express.json())
app.use(cookieParser())

// ✅ Routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
  connectDb()
  console.log('Server started on port', port)
})
