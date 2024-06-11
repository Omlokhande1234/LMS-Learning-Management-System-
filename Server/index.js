import dbConnection from './Database Config/databaseConfig.js'
import app from './app.js'
import dotenv  from 'dotenv'
dotenv.config()
const PORT=process.env.PORT

app.listen(PORT,async()=>{
    console.log(`Server running on the port  ${PORT}`)
    await dbConnection()

})