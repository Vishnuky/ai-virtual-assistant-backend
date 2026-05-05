import 'dotenv/config'
import express from 'express'
import connectDb from './config/db.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-virtual-assistant-ou1m.onrender.com'
]

// ✅ Proper CORS configuration (supports cookies)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

// ✅ Apply CORS
app.use(cors(corsOptions))

// ✅ FIX: Preflight must use SAME config (important for cookies)
app.options('*', cors(corsOptions))

// ✅ Middlewares
app.use(express.json())
app.use(cookieParser())

// ✅ Routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

// ✅ Start server
const port = process.env.PORT || 5000

app.listen(port, () => {
  connectDb()
  console.log('Server started on port', port)
})
