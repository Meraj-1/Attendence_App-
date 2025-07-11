// import { asynHandler}  from "../utils/asyncHandler.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Employee from "../models/employeemodel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();
    employee.refreshToken = refreshToken;
    await UserActivation.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating token", error);
    throw new ApiError(
      500,
      "something went wrong while generating refresh access token"
    );
  }
};



const registerEmployee = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body); // Debug log

  const { name, email, password, role } = req.body;

  if (!req.body) {
    throw new ApiError(400, "Request body is missing");
  }

  if (
    [name, email, password, role].some((field) => !field || field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedEmployee = await Employee.findOne({
    $or: [{ name }, { email }],
  });

  if (existedEmployee) {
    throw new ApiError(409, "Employee Already Existed");
  }

  const employee = await Employee.create({
    name,
    email,
    password,
    role,
  });

  const createdEmployee = await Employee.findById(employee._id).select(
    "-password -refreshToken"
  );

  if (!createdEmployee) {
    throw new ApiError(500, "something went wrong while registering");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdEmployee, "Employee resgistered succesfully")
    );
});







export { registerEmployee };
