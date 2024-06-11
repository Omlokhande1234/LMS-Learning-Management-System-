import dbConnection from './Database Config/databaseConfig.js'
import app from './app.js'
import dotenv  from 'dotenv'
import cloudinary from 'cloudinary'
dotenv.config()
const PORT=process.env.PORT
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
app.listen(PORT,async()=>{
    console.log(`Server running on the port  ${PORT}`)
    await dbConnection()

})