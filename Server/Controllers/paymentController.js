import Payment from "../Models/paymentModel.js";
import User from "../Models/userModel.js";
import { razorPay } from "../index.js";
import { errorhandler } from "../utils/errorHandler.js";
import dotenv from 'dotenv'
dotenv.config()
export const getRazorpayKey=async(req,res,next)=>{
    try{
            res.status(200).json({
            success:true,
            message:"RazorPay api key fetched",
            key:process.env.RAZORPAY_KEY_ID
         })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const BuySubscription=async(req,res,next)=>{
    try{
          // Extracting ID from request obj
        const {id}=req.user
        // Finding the user based on the ID
        const user=await User.findById(id)
        if(!user){
            return next(errorhandler(400,"unauthenticated user"))
        }
        // Checking the user role
        if(user.role=='ADMIN'){
            return next(errorhandler(400,"Admin cant buy the courses or subscription"))
        }
        // Creating a subscription using razorpay that we imported from the server
        const subscription=await razorPay.subscriptions.create({
            plan_id:process.env.RAZORPAY_PLAN_ID, // The unique plan ID
            customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
            total_count: 12 // 12 means it will charge every month for a 1-year sub.
        })
        console.log(subscription)
        // Adding the ID and the status to the user account
        user.subscription.id=subscription.id
        user.subscription.status=subscription.status

        //saving the user
        await user.save()
        res.status(200).json({
            success:true,
            message:"subscribed successfully",
            subscription_id:subscription.id
        })


    }
    catch(error){
        console.log(error)
        return next(errorhandler(400,error.message))
    }
}
export const verifySubscription=async(req,res,next)=>{
    try{
        

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const cancelSubscription=async(req,res,next)=>{
    try{

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const allPayments=async(req,res,next)=>{
    try{

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}