import express from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import { requireAuth, currentUser } from '@kunleticket/common';


const router = express.Router();

router.route('/sign-up').post(async (req, res) => {

    const user = await User.create(req.body)

    const userjwt = jwt.sign({
        id: user._id,
        image: user.image
    }, process.env.JWT_KEY);

    res.cookie('secretoken', userjwt, {
        httpOnly: true,
        secure: req.secure
    })

    res.status(201).send(user)
});

router.route('/get-users').get(async (req, res) => {
    const users = await User.find();

    res.send(users)
});

export { router as userRoute }