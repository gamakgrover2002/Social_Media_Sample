// routes/events.routes.js
import express from 'express';
import { addEvent,getEvents } from '../controllers/events.controller.js';

const router = express.Router();


router.route("/").post(addEvent); 
router.route("/").get(getEvents)

export default router;
