import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'

import errorMiddleware from './Middlewares/errorMiddleware.js'
import authRoutes from './Routes/authRoutes.js'
import courseRoutes from './Routes/courseRoutes.js'
import paymentRoutes from './Routes/paymentRoutes.js'
import googleRoutes from './Routes/googleApiRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'
const app=express()


// CORS should be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://lms-frontend-1-fq47.onrender.com/'], 
  credentials: true
}));
// Handle preflight requests explicitly
app.options('*', cors());
app.use('/api/v1/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json())
//Used to parse the info from the encoded url
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/user',authRoutes)
app.use('/api/courses',courseRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/googleApi',googleRoutes)
app.use('/api/admin',adminRoutes)
app.use(errorMiddleware)


export default app