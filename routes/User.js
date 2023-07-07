import { Router } from "express";
const router = Router();
import AuthAdmin from "../middlewares/AuthAdmin.js";
import User from "../models/User.js";
import { performance } from "perf_hooks";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import AuthUser from "../middlewares/AuthUser.js";

router.get("/alluser", AuthAdmin, async (req, res) => {
  const Users = await User.find({});
  if (Users.length === 0) {
    return res.status(400).send("No user found");
  }
  res.status(200).json(Users);
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email, password });
    let ACCESS_TOKEN = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });
    let REFRESH_TOKEN = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    await RefreshToken.create({ token: REFRESH_TOKEN });
    res.json({ ACCESS_TOKEN, REFRESH_TOKEN });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    let now = performance.now();
    const { email, password, role } = req.body;
    let IsUserExist = await User.findOne({ email });
    if (IsUserExist) {
      return res.status(400).send("User already exists");
    } else {
      let user = new User({ email, password, role });
      await user.save();
      let after = performance.now();
      res.json(user);
      console.log(after - now);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/token", async (req, res) => {
  try {
    const { REFRESH_TOKEN } = req.body;
    if (!REFRESH_TOKEN) {
      return res.status(400).send("Refresh token not found");
    }
    let IsRefreshTokenExist = await RefreshToken.findOne({
      token: REFRESH_TOKEN,
    });
    if (!IsRefreshTokenExist) {
      return res.status(400).send("Refresh token not found");
    }
    jwt.verify(
      REFRESH_TOKEN,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(400).send("Invalid refresh token");
        }
        let isUser;
        try {
          isUser = await User.findById(user.user._id);
        } catch (error) {
          res.status(400).send(error);
        }
        if (!isUser) {
          res.status(400).send("User not found");
        } else {
          try {
            let ACCESS_TOKEN = jwt.sign(
              { user },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1m",
              }
            );
            let REFRESH_TOKEN = jwt.sign(
              { user },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: "5m",
              }
            );
            await RefreshToken.create({ token: REFRESH_TOKEN });
            res.json({ ACCESS_TOKEN, REFRESH_TOKEN });
          } catch (error) {
            console.log(error);
            res.status(400).send(error);
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/logout", AuthUser, async (req, res) => {
  const { REFRESH_TOKEN } = req.body;
  if (!REFRESH_TOKEN) {
    return res.status(400).send("Refresh token not found");
  }
  try {
    jwt.verify(REFRESH_TOKEN, process.env.REFRESH_TOKEN_SECRET, async (err) => {
      if (err) {
        return res.status(400).send("Invalid refresh token");
      }
      await RefreshToken.deleteOne({ token: REFRESH_TOKEN });
      res.status(200).send("Logout successfully");
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
