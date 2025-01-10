import { asyncHandler } from "../utils/asyncHandler.js";
import Events from "../models/Events.model.js"
import { ApiError } from "../utils/ApiError.js";
// only ann Admin can create an event
const addEvent = asyncHandler(async(req,res)=>{
 const {eventName,dateOrganized,tasks} = req.body;
 if(!eventName || !dateOrganized || !tasks ){
    throw new ApiError("All fields are required",400);
 }
 const event = await Events.findOne({eventName});
 if(event){
    throw new ApiError("Event already exists",400);
 }
 if(req.user.role =="User"){
    throw new ApiError("Only organizers can create events",403);
 }
 const createdBy = req.user._id.toString();
 if(!createdBy){
    throw new ApiError("User not authenticated",401);
 }
 const newEvent = await Events.create({eventName,dateOrganized,tasks,createdBy});
res.status(201).json(newEvent);
})
const getEvents = asyncHandler(async(req,res)=>{
   if(req.role="User"){
      const events = await Events.find({});
      res.json(events);
   }
   if(req.role="Admin"){
      const events = await Events.find({createdBy:req.user._id});
      res.json(events);
   }
})

export {addEvent,getEvents}