import Router from 'express'
import upload from '../Middlewares/multerMiddlewares.js'
import {isLoggedin,authorizeRoles} from '../Middlewares/authMiddlewares.js'
import { createCourse, getAllCourses,getLecturesById,updateCourse,removeCourse,addLecturesByID } from '../Controllers/courseController.js'
const router=Router()
router.route('/')
   .get(getAllCourses)
   .post(isLoggedin,authorizeRoles('ADMIN'),upload.single("thumbnail"),createCourse)
router.route('/:id')
      .get(isLoggedin,getLecturesById)
      .put(isLoggedin,authorizeRoles('ADMIN'),updateCourse)
      .delete(isLoggedin,authorizeRoles('ADMIN'),removeCourse)
      .post(isLoggedin,authorizeRoles('ADMIN'),upload.single("lecture"),addLecturesByID)


export default router