import dbConnection from './Database Config/databaseConfig.js'
import app from './app.js'
import dotenv  from 'dotenv'
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'
dotenv.config()
const PORT=process.env.PORT
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
export const razorPay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET

})
app.listen(PORT,async()=>{
    console.log(`Server running on the port  ${PORT}`)
    await dbConnection()

})