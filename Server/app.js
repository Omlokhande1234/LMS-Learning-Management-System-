import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import errorMiddleware from './Middlewares/errorMiddleware.js'
import authRoutes from './Routes/authRoutes.js'
const app=express()


app.use(express.json())
//Used to parse the info from the encoded url
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/user',authRoutes)
app.use(errorMiddleware)
app.use(cors({
    user:"*",
    creadentials:true
}))


export default app