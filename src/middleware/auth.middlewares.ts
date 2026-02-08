import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

interface jwtPayload {
    userId:string
};

export interface AuthRequest extends Request {
    user?:jwtPayload;
}

export const protect = (req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
  return res.status(401).json({
    success: false,
    message: "Not Authorized",
  });
}


        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwtPayload;

        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({message:"Invalid or Expired Token"})
    }
}