import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "leave"],
    default: "present", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;