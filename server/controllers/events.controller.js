import { asyncHandler } from "../utils/asyncHandler.js";
import Events from "../models/events.model.js"
import { ApiError } from "../utils/ApiError.js";
import { createTask } from "./tasks.controller.js";

const addEvent = asyncHandler(async (req, res) => {
   const { eventName, dateOrganized, tasks } = req.body;
 

   if (!eventName || !dateOrganized || !Array.isArray(tasks) || tasks.length === 0) {
     throw new ApiError("All fields (eventName, dateOrganized, and tasks) are required", 400);
   }

   const existingEvent = await Events.findOne({ eventName });
   if (existingEvent) {
     throw new ApiError("Event with this name already exists", 400);
   }
 

   if (req.user.role !== "Organizer") {
     throw new ApiError("Only organizers can create events", 403);
   }
 

   const createdBy = req.user._id?.toString();
   if (!createdBy) {
     throw new ApiError("User not authenticated", 401);
   }

   try {
     const taskIds = await Promise.all(
       tasks.map(async (task) => {
         if (!task.taskId || !task.taskName || !task.description) {
           throw new ApiError("Each task must have taskId, taskName, and description", 400);
         }
         await createTask(task.taskId, task.taskName, task.description);
         return task.taskId;
       })
     );
 
     // Create a new event
     const newEvent = await Events.create({
       eventName,
       dateOrganized,
       tasks: taskIds,
       createdBy,
     });
 
     res.status(201).json(newEvent);
   } catch (err) {
     // Log and rethrow error for consistent error handling
     console.error("Error creating tasks or event:", err.message);
     throw new ApiError(err.message || "Failed to create event", 500);
   }
 });
 
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