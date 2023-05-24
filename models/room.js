import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'room name is required']
  },
  users: [{
    type: mongoose.Types.ObjectId,
  }],
  roomsize: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, 'room must belong to someone']
  }
});

const room = mongoose.model('Room', roomSchema);

export { room as Room }