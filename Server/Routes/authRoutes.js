import { Router } from "express";
import {isLoggedin} from '../Middlewares/authMiddlewares.js'
import { Signup, getUser, google, signin, signout } from "../Controllers/authController.js";
import upload from "../Middlewares/multerMiddlewares.js";
const router=Router()

router.post('/signup',upload.single("avatar"),Signup)
router.post('/signin',signin)
router.get('/signout',signout)
//Here the user will we verified by using the authMiddleWares and then its details will be fetched 
router.get('/getuser',isLoggedin,getUser)
router.post('/google',google)
export default router