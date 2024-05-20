const jwt=require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailFromToken= async (token)=>{
    if(!token){
        return {
            message:"session closed",
            logout:true,
        }
    }
    try {
        const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await UserModel.findById(decode.id).select('-password');
        return user;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return {
                message: 'Token expired',
                logout: true,
            };
        }
        // Handle other JWT errors if needed
        throw error; // Re-throw the error for other cases
    }
}
module.exports=getUserDetailFromToken