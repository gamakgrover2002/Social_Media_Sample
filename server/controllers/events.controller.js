import { asyncHandler } from "../utils/asyncHandler.js";
import Events from "../models/Events.model.js"
import { ApiError } from "../utils/ApiError.js";

const addEvent = asyncHandler(async(req,res)=>{
 const {eventName,dateOrganized,tasks,createdBy} = req.body;
 if(!eventName || !dateOrganized || !tasks || !createdBy){
    throw new ApiError("All fields are required",400);
 }
 const event = await Events.findOne({eventName});
 if(event){
    throw new ApiError("Event already exists",400);
 }
 const newEvent = await Events.create({eventName,dateOrganized,tasks,createdBy});
res.status(201).json(newEvent);
})
const getEvents = asyncHandler(async(req,res)=>{
    const events = await Events.find({});
    res.json(events);
})
export {addEvent,getEvents}