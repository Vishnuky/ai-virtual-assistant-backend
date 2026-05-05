import 'dotenv/config'
import express from 'express'
import connectDb from './config/db.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-virtual-assistant-ou1m.onrender.com'
]

// ✅ Clean CORS config (handles preflight automatically)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
  connectDb()
  console.log('Server started on port', port)
})
