import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
const app=express()

app.use(express.json())
app.use(cors({
    user:"*",
    creadentials:true
}))
app.use(cookieParser())

export default app