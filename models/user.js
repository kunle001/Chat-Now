import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name']
  },
  image: {
    type: String,
    default: 'default.jpg'
  }
});

const user = mongoose.model('User', userSchema);

export { user as User }