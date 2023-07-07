import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
});

const User = mongoose.model("User", UserSchema);

export default User;