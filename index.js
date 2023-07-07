import './db/connection.js'
import express from "express";
import User from "./routes/User.js";
import bodyParser from "body-parser";
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", User);

app.listen(4000, () => {
  console.log("Example app listening on port 3000!");
});
