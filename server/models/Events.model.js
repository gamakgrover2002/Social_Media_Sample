import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    eventName: String,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dateOrganized: Date,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
  });

const Events = mongoose.model("Events",eventSchema);

export default Events;