import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import errorMiddleware from './Middlewares/errorMiddleware.js'
import authRoutes from './Routes/authRoutes.js'
const app=express()


app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use(errorMiddleware)
app.use(cors({
    user:"*",
    creadentials:true
}))


export default app