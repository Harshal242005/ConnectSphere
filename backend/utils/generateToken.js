import jwt from "jsonwebtoken";



const generateToken = (id, res) => {

    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "15d",

    })

    res.cookie("token", token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })

    
    
    
}
export default generateToken;