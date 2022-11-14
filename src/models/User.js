import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
  },
});

UserSchema.methods.setImgUrl = function setImgUrl(filename) {
  const HOST = 'http://localhost';
  const PORT = process.env.PORT || 3000;
  this.imgUrl = `${HOST}:${PORT}/img/${filename}`
}

export default mongoose.model("User", UserSchema);