// routes/events.routes.js
import express from 'express';
import { addEvent,getEvents,deleteEvent,updateEvent } from '../controllers/events.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
const router = express.Router();


router.route("/").post(verifyJWT,addEvent); 
router.route("/").get(verifyJWT,getEvents)
router.route("/:eventId").delete(verifyJWT,deleteEvent)
router.route("/:eventId").put(verifyJWT,updateEvent)

export default router;
