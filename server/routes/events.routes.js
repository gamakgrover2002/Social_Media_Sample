// routes/events.routes.js
import express from 'express';
import { addEvent,getEvents } from '../controllers/events.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
const router = express.Router();


router.route("/").post(verifyJWT,addEvent); 
router.route("/").get(verifyJWT,getEvents)

export default router;
