import { Router } from "express";
import { Signup, getUser, google, signin, signout } from "../Controllers/authController.js";
const router=Router()

router.post('/signup',Signup)
router.post('/signin',signin)
router.get('/signout',signout)
router.get('/getuser',getUser)
router.post('/google',google)
export default router