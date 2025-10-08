import Router from 'express'
import{allPayments,getRazorpayKey,BuySubscription,verifySubscription,cancelSubscription,razorpayWebhook} from '../Controllers/paymentController.js'
import { authorizeRoles, isLoggedin } from '../Middlewares/authMiddlewares.js'

const router=Router()
router.route('/razorpay-key').get(isLoggedin,getRazorpayKey)
router.route('/subscription').post(isLoggedin,BuySubscription)
router.route('/verify').post(isLoggedin,verifySubscription)
router.route('/unsubscribe').post(isLoggedin,cancelSubscription)
router.route('/').get(isLoggedin,authorizeRoles('ADMIN'),allPayments)
router.route('/webhook').post(razorpayWebhook)

export default router