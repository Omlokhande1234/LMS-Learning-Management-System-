import User from '../Models/userModel.js'
import bcrypt from 'bcryptjs'
import { errorhandler } from '../utils/errorHandler.js'
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()

const cookieOptions = {
    secure: true ,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  }
export const Signup=async(req,res,next)=>{
    const{username,email,password}=req.body
    try{
        if(!username||!email||!password){
            return next(errorhandler(400,"All the fields are required"))
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return next(errorhandler(400,"User already exists"))
        }
        const hashedPassword=bcrypt.hashSync(password,10)
        const user=await User.create({
            username,
            email,
            password:hashedPassword,
            avatar: {
                public_id: email,
                secure_url:
                  'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            }
        })
        if(!user){
            return next(errorhandler(400,"Error while creating the user"))
        }
        console.log("file details",JSON.stringify(req.file))
        if(req.file){
            try{
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',// Save files in a folder named lms
                    width:250,
                    height:250,
                    // Gravity:This option tells cloudinary to center the image around detected faces (if any) 
                    //after cropping or resizing the original image
                    gravity:'faces',
                    crop:'fill'
                })
                if(result){
                     // Set the public_id and secure_url in DB
                    user.avatar.public_id=result.public_id
                    user.avatar.secure_url=result.secure_url
                    // After successful upload remove the file from local storage of 
                    //server
                    //If the below line is not written then we can see the file taken from the 
                    //form data from client will be saved in uploads folder
                    //But when we write the below line it deletes the file and store it to cloudinary
                    fs.rm(`uploads/${req.file.filename}`)
                }

            }
            catch(e){
                return next(errorhandler(400,e.message))
            }
        }
        
        await user.save()
        user.password=undefined

        const token=await user.generateJWTToken()
        res.cookie('token',token,cookieOptions)
        res.status(200).json({
            success:true,
            message:"User created successfully",
            user
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const signin=async (req,res,next)=>{
    const{email,password}=req.body
    try{
        if(!email||!password){
            return next(errorhandler(400,"All the fields are required"))
        }
        const user=await User.findOne({email}).select('+password')
        if(!user||!bcrypt.compareSync(password,user.password)){
            return next(errorhandler(400,"Invalid email or password"))
        }
        const token=user.generateJWTToken()
        const{password:pass,...rest}=user._doc
        res.cookie('token',token,cookieOptions)
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            rest
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const signout=async(req,res,next)=>{
    try{
        res.clearcookie('token')
        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))

    }
}
export const getUser=async(req,res,next)=>{
    try{
        const user_id=req.user.id
        const user=await User.findById(user_id)
        res.status(200).json({
        success:true,
        message:"User details",
        user
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))

    }
}
export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email})
        if(user){
            const token=newUser.generateJWTToken()
            const{password,...rest}=newUser._doc
            res.cookie('token',token,cookieOptions)
        }
        else{
            const generatedpassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatedpassword,10)
            const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo})
            await newUser.save()
            const token=newUser.generateJWTToken()
            const{password,...rest}=newUser._doc
            res.cookie('token',token,cookieOptions)
            console.log(newUser._doc)
        }
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}