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
const deleteEvent = asyncHandler(async (req, res) => {
   if(req.role="Admin"){
   const id = req.params.eventId; 
   const deletedEvent = await Events.findByIdAndDelete({_id: id}); 
   if(!deletedEvent){
      throw new ApiError("Event not found",404);
   }
   res.status(200).send("Event deleted")
   }
   else{
      throw new ApiError("Only organizers can delete events",403);
   }
});
const updateEvent = asyncHandler(async (req, res) => {
   const {dateOrganized,eventName} = req.body;
   if(req.role="Admin"){
   const id = req.params.eventId; 
   const event = await Events.findById({_id: id}); 
   if(!event){
      throw new ApiError("Event not found",404);
   }
   if(dateOrganized){
      event.dateOrganized = dateOrganized;
   }
   if(eventName){
      event.eventName = eventName;
   }
   await event.save();
   res.status(200).send("Event updated")
   }

      throw new ApiError("Only organizers can delete events",403);
});

export {addEvent,getEvents,deleteEvent,updateEvent}