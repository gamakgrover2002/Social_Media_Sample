import mongoose , {Schema} from "mongoose"

const TaskSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    EventId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'  
    }
  });
  const Task = mongoose.model('Task',TaskSchema);
   export default Task;