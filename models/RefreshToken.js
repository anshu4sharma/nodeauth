import mongoose from "mongoose";
const Schema = mongoose.Schema;
const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    unique: true,
  },
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
