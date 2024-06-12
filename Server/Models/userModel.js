import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [5, 'Name must be at least 5 characters'],
      lowercase: true,
      trim: true, // Removes unnecessary spaces
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
      ], // Matches email against regex
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Will not select password upon looking up a document
    },
    subscription: {
      id: String,
      status: String,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  // Will generate a JWT token with user id as payload
  generateJWTToken: async function () {
   
        return await jwt.sign(
            { id: this._id,email:this.email, role: this.role, subscription: this.subscription },
            process.env.SECRET,
            {
              expiresIn: process.env.JWT_EXPIRE,
            }
          );
  },
  generatePasswordResetToken:async function(){
    const resetToken=crypto.randomBytes(20).toString('hex')
    this.forgotPasswordToken=crypto
     .createHash('sha256')
     .update(resetToken)
     .digest('hex')
    this.forgotPasswordExpiry=Date.now()+15*60*1000 //Token valid for 15 min from now
    return resetToken

  }
};

const User = model('User', userSchema);

export default User;