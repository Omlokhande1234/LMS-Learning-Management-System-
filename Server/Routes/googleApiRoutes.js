import { Router } from "express";
import { chatWithAi } from "../Controllers/googleAiController.js";
import{ isLoggedin} from '../Middlewares/authMiddlewares.js'

const router=Router()

router.get('/chatAi',isLoggedin,chatWithAi)

export default router