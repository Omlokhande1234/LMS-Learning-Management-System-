import Course from "../Models/courseModel.js"
import cloudinary from'cloudinary'
import {errorhandler} from '../utils/errorHandler.js'
import fs from 'fs/promises'

export const getAllCourses=async(req,res,next)=>{
    //select all info from courses except the lectures
    const courses=await Course.find({}).select('-lectures')
    try{
        return res.status(200).json({
            success:true,
            message:"Courses are listed",
            courses
        })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

    

}
export const getLecturesById=async(req,res,next)=>{
    const {id}=req.params
    try{
        const course=await Course.findById(id)
    if(!course){
        return next(errorhandler(400,"Course not found"))
    }
    return res.status(200).json({
        success:true,
        message:"Lectures of course fetched successfully",
        lectures:course.lectures
    })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}
export const createCourse=async(req,res,next)=>{
    const{title,
        description,
        category,
        createdBy
    }=req.body
    try{
        if(!title,!description,!category,!createdBy){
            return next(errorhandler(400,'All the fields are required'))
        }
        const course=await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id: title,
                secure_url:
                'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
            }
        })
        if(!course){
            return next(errorhandler(400,"Error in creating the user"))
        }
        if(req.file){
            try{
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms'
                })
                if(!result){
                    return next(errorhandler(400,"Error in saving the file"))
                }
                course.thumbnail.public_id=result.public_id
                course.thumbnail.secure_url=result.secure_url

                fs.rm(`uploads/${req.file.filename}`)

            }
            catch(error){
                return next(errorhandler(400,error.message))
            }
        }
        await course.save()
        return res.status(200).json({
            success:true,
            message:"course created successfully",
            course
        })

    }
    
    catch(error){
        return next(errorhandler(400,error.message))
    }
    
}
export const updateCourse=async(req,res,next)=>{
    try{
        const {id}=req.params
        const course=await Course .findByIdAndUpdate(
            id,{
                $set:req.body //this will only update the fields which are present
            },
            {
                runValidators: true, // This will run the validation checks on the new data
            }
        )
        if(!course){
            return next(errorhandler(400,"course with id not found"))
        }
        await course.save()
        return res.status(200).json({
            success:true,
            message:"course updated successfully",
            course
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const removeCourse=async(req,res,next)=> {
    try{
        const{id}=req.params
        const course=await Course.findById(id)
        if(!course){
            return next(errorhandler(400,"course with id dont exist"))
        }
        await Course.findByIdAndDelete(id)
        return res.status(200).json({
            success:true,
            message:"Course removed successfully"
        })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const addLecturesByID=async(req,res,next)=>{
    try{
        const{title,description}=req.body
        const{id}=req.params
        let lectureData={}
        if(!title||!description){
            return next(errorhandler(400,"All the fields are required"))
        }
        const course=await Course.findById(id)
        if(!course){
           return next(errorhandler(400,"course does not exists"))
        }
        if(req.file){
            try{
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    chunk_size:50000000,
                    resource_type:'video'
                })
                if(!result){
                    return next(errorhandler(400,"error in uploading video"))
                }
                lectureData.public_id=result.public_id
                lectureData.secure_url=result.secure_url
 
                fs.rm(`uploads/${req.file.filename}`)

            }
            catch(error){
                return next(errorhandler(400,error.message))
            }

        }
        course.lectures.push({
            title,
            description,
            lecture:lectureData
        })
        course.NumberOfLectures=course.lectures.length
        await course.save()
        return res.status(200).json({
            success:true,
            message:"Lectures added to course successfully"
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}