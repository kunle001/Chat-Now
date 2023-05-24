import express from 'express'
import { Room } from '../models/room.js';
import { currentUser, requireAuth } from '@kunleticket/common';

const router = express.Router();

router.route('/create-room').post(requireAuth, currentUser, async (req, res) => {
  const { roomSize, name } = req.body

  // console.log('!!!!!!!!!!!!!!!!!1', req.currentUser)
  const room = await Room.create({
    roomSize,
    name,
    owner: req.currentUser.id
  });

  room.users.push(req.currentUser.id);
  room.roomsize += 1

  await room.save();

  res.status(201).send(room)

});

router.route('/join/:id').patch(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404).send({
      message: `room id : ${req.params.id} wasn't found`
    })
  };

  room.users.push(req.currentUser.id);
  room.roomsize += 1
  await room.save();

  res.send(room)
});

router.route('/leave/:id').patch(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).send({
      message: `room id : ${req.params.id} wasn't found`
    })
  };

  room.users.remove(req.currentUser.id);
  await room.save();

  res.send(room)
});

export { router as RoomRoute }