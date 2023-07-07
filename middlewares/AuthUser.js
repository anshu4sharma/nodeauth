import jwt from "jsonwebtoken";
import "dotenv/config";
const AuthUser = async (req, res, next) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      return res.status(401).send("Access denied");
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
          return res.status(401).send("Access denied");
        }
        next();
      });
    }
  } catch (error) {
    res.status(401).send("Token  maybe invalid or expired");
  }
};

export default AuthUser;
