import Task from "../models/tasks.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Events from "../models/events.model.js";

export const createTask = async(description,isCompleted,eventId)=>{
 const newTask = Task.create({
    description,
    isCompleted,
    eventId
 })
 console.log(newTask)

}
export const addTask = asyncHandler(async(req,res)=>{
    const {taskName,description} = req.body;
    const eventId = req.params.eventId;
    if(!taskName || !description ){
      throw new ApiError("All fields  are required", 400);
    }
   if(!eventId){
      throw new ApiError("Event id is required", 400);
   }
   const newTask = await Task.create({
      description,
      isCompleted:false,
      eventId
   })
   res.status(201).json({message: "Task created successfully", task:newTask})
})
export const getTasks = asyncHandler(async(req,res)=>{
   const eventId = req.params.eventId;
   const tasks = await Task.find({
      eventId
   })
   if(tasks.length===0){
      throw new ApiError("No tasks found for this event", 404);
   }
   res.status(200).json(tasks)
})
export const updateTaskStatus = asyncHandler(async (req, res) => {
   const { eventId, taskId } = req.params;

   if (!eventId || !taskId) {
     throw new ApiError("Event ID and Task ID are required", 400);
   }

   const event = await Events.findById(eventId);
   if (!event) {
     throw new ApiError("Event not found", 404);
   }

   const task = await Task.findOne({ _id: taskId, eventId });
   if (!task) {
     throw new ApiError("Task not found for this event", 404);
   }
 
   task.isCompleted = true; 
   await task.save();
 
   res.status(200).json({ message: "Task status updated successfully", task });
 });
export {createTask,addTask,getTasks,updateTaskStatus}