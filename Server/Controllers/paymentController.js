import Payment from "../Models/paymentModel.js";
import User from "../Models/userModel.js";
import { razorPay } from "../index.js";
import { errorhandler } from "../utils/errorHandler.js";
import dotenv from 'dotenv'
import crypto from 'crypto'
import { createDeflate } from "zlib";
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
        // Ensure subscription object exists on user before assignment
        user.subscription = user.subscription || {}
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
export const verifySubscription = async (req, res, next) => {
  try {
    // Get the Id of the user
    const { id } = req.user;

    // Get payment details from body
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    // Find the user and subscription
    const user = await User.findById(id);
    const subscriptionId = user?.subscription?.id;
    if (!subscriptionId) {
      return next(errorhandler(400, "Subscription not initiated"));
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(errorhandler(400, "Payment not verified, please try again"));
    }

    // Persist payment
    await Payment.create({
      Payment_id: razorpay_payment_id,
      subscription_id: razorpay_subscription_id,
      signature: razorpay_signature,
    });

    // Activate subscription
    user.subscription.status = "active";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment is verified",
    });
  } catch (error) {
    console.log(error);
    return next(errorhandler(400, error.message));
  }
};

export const cancelSubscription = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) return next(errorhandler(400, "Unauthenticated user"));
    if (user.role === "ADMIN") {
      return next(errorhandler(400, "Admin cant unsubscribe"));
    }

    const subscriptionId = user?.subscription?.id;
    if (!subscriptionId) return next(errorhandler(400, "No active subscription"));

    // Cancel subscription at Razorpay
    const subscription = await razorPay.subscriptions.cancel(subscriptionId);
    user.subscription.status = subscription.status;
    await user.save();

    // Refund if within 14 days
    const payment = await Payment.findOne({ subscription_id: subscriptionId });
    const timeSubscribed = payment?.createdAt
      ? Date.now() - payment.createdAt.getTime()
      : Number.POSITIVE_INFINITY; // if not found, skip refund
    const refundPeriod = 14 * 24 * 60 * 60 * 1000;

    if (timeSubscribed <= refundPeriod && payment?.Payment_id) {
      await razorPay.payments.refund(payment.Payment_id, { speed: "optimum" });
    }

    // Clear user subscription
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();

    if (payment) await payment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Unsubscribe successfully",
    });
  } catch (error) {
    console.log(error);
    return next(errorhandler(400, error.message));
  }
};
export const allPayments = async (req, res, next) => {
  try {
    // Fetch all payments
    const payments = await Payment.find({}).sort({ createdAt: 1 });

    // Build last 12 months sales record based on createdAt
    const now = new Date();
    const monthlySalesRecord = new Array(12).fill(0);
    const finalMonths = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      finalMonths.push(d.toLocaleString('en-US', { month: 'long' }));
    }

    payments.forEach((p) => {
      const diffMonths = (now.getFullYear() - p.createdAt.getFullYear()) * 12 + (now.getMonth() - p.createdAt.getMonth());
      if (diffMonths >= 0 && diffMonths < 12) {
        const index = 11 - diffMonths; // map oldest->0 ... current->11
        monthlySalesRecord[index] += 1;
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      allPayments: { count: payments.length },
      finalMonths,
      monthlySalesRecord,
    });
  } catch (error) {
    return next(errorhandler(400, error.message));
  }
}