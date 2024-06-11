import { errorhandler } from "../utils/errorHandler.js"
import jwt from 'jsonwebtoken'
import dotenv from'dotenv'
dotenv.config()

export const isLoggedin=(req,res,next)=>{
    //Requesting the cookies if exists
    const  { token }  =req.cookies
    try{
        //If the cookies dont exist then return unauthenticated user
    if(!token){
        return next(errorhandler(400,"Unauthenticated user"))
    }
    //If the token exists then store the data from the token in the userDetails
    const userDetails=jwt.verify(token,process.env.SECRET)
    //If the data is not fetch then return unable to fetch the data
    if(!userDetails){
        return next(errorhandler(400,'Unable to fetch the user details'))
    }
    //If the data is fetched then just put it in req.user
    req.user=userDetails
    //next() is called to continue the flow of the execution
    next()
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}
