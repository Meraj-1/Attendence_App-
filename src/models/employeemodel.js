import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'password is must be required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["employee", "admin", "manager"],
    default: "employee",
    department: String,
    joiningDate: { default: Date.now },
    isActive: { type: Boolean, default: true },
  },
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified('password'))
    return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

employeeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, 
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};


const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
