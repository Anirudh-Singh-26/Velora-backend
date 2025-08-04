const jwt= require("jsonwebtoken");

function verifyToken(req, res, next){
    const token= req.cookies.token;
    console.log("Verify")

    if(!token) {
        console.log("!Token")
        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return res.status(401).json({ msg: "Unauthorized: No token" });     
    }
    try {
        console.log("Try");
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user= decode;
        next();
    } catch (err) {
        console.log("Catch");
        console.log("Auth Middleware Catch")
      return res.status(403).json({ msg: "Forbidden: Invalid token" });
    }

}

module.exports= {verifyToken};