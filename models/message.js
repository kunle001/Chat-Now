import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'who is the sender']
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'who is the reciever']
  },
  room: {
    type: mongoose.Types.ObjectId,
    required: [true, 'a message needs to belong to a room']
  },
  content: {
    type: String,
    required: [true, 'message must have a content']
  },
  date: {
    type: mongoose.Schema.Types.Date,
    default: Date.now
  }
});

const message = mongoose.model('Message', messageSchema);

export { message as Message }