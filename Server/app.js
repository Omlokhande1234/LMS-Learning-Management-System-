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
    origin: "http://localhost:5173",
    credentials: true,
}))


app.use(express.json())
//Used to parse the info from the encoded url
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/user',authRoutes)
app.use('/courses',courseRoutes)
app.use('/payment',paymentRoutes)
app.use('/googleApi',googleRoutes)
app.use('/admin',adminRoutes)
app.use(errorMiddleware)


export default app