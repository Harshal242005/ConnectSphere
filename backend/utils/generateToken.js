import jwt from "jsonwebtoken";



const generateToken = (id, res) => {

    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "15d",

    })

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    })

    
    
    
}
export default generateToken;
