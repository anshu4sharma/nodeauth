import jwt from "jsonwebtoken";
import "dotenv/config";
const AuthAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);
  try {
    if (!token) {
      return res.status(401).send("Access denied");
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        console.log(data);
        if (data.user.role !== "admin") {
          return res.status(401).send("Access denied");
        }
        next();
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Token  maybe invalid or expired");
  }
};

export default AuthAdmin;
