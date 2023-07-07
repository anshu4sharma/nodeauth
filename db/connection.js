import { connect } from "mongoose";
import "dotenv/config";
connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
