import  jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'
import dotenv from 'dotenv';
dotenv.config();

// Use a consistent JWT secret - either from environment or fallback
const JWT_SECRET = process.env.JWT_SECRET;

const isAdmin=async(req,res,next)=>{
    try {
         const token=req.cookies.token
         if (!token) {
            return res.status(401).json({messsage:"'Unauthorized: No token provided'"})
         }

         const decoded= jwt.verify(token, JWT_SECRET)
         const user=await UserModel.findById(decoded.userId)
         if (!user) {
            return res.status(401).json({messsage:"'user not found'"})
         }

         if (user.role !=='admin') {
            return res.status(403).json({messsage:'Unauthorized: User is not an admin'})
         }
       req.user=user
         next()
      
    } catch (error) {
        console.log('JWT verification error:', error.message)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({messsage:"'Unauthorized: Invalid token - please log in again'"})
        }
        return res.status(401).json({messsage:"'Unauthorized: Invalid token'"})
    }
}

const IsUser=async(req,res,next)=>{
   try {
      const token=req.cookies.token
      if (!token) {
         return res.status(401).json({messsage:"'Unauthorized: No token provided'"})
      }

      const decoded= jwt.verify(token, JWT_SECRET)
      const user=await UserModel.findById(decoded.userId)
      if (!user) {
         return res.status(401).json({messsage:"'user not found'"})
      }

    
    req.user=user
      next()
   
 } catch (error) {
     console.log('JWT verification error:', error.message)
     if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({messsage:"'Unauthorized: Invalid token - please log in again'"})
     }
     return res.status(401).json({messsage:"'Unauthorized: Invalid token'"})
 }
}


export {isAdmin,IsUser}