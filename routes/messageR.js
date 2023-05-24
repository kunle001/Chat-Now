import { currentUser, requireAuth } from '@kunleticket/common';
import { Message } from '../models/message.js';
import express from 'express';

const router = express.Router();

router.route('/send-message').post(requireAuth, currentUser, async (req, res) => {
  const message = await Message.create({
    room: req.body.room,
    sender: req.currentUser.id,
    receiver: req.body.receiver,
    content: req.body.content
  });

  res.status(201).send(message)
});

router.route('/get-room-messages/:roomId').get(async (req, res) => {
  const messages = await Message.find({
    room: req.params.roomId
  });

  res.send(messages)
})

router.route('/get-user-messages/:id').get(async (req, res) => {
  const messages = await Message.find({
    sender: req.params.id
  }).populate(['']);

  res.send(messages)
});

router.route('/get-message/:senderId/and/:recieverId').get(async (req, res) => {
  const messages = await Message.find({
    sender: req.params.senderId,
    reciever: req.params.recieverId
  });

  res.send(messages)
});

export { router as messageRoute }