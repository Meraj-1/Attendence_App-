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
    if (!employee) {
      throw new Error("Employee not found");
    }

    const accessToken = employee.generateAccessToken();
    const refreshToken = employee.generateRefreshToken();

    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error Generating token", error);
    throw new ApiError(
      500,
      "Something went wrong while generating refresh/access token"
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


const loginEmployee = asyncHandler(async (req, res) => {
  let {email , password} = req.body;

  if(!email && password) {
    throw new ApiError(400, "email & password both required");
  }

  const employee = await Employee.findOne({
     $or: [{email}]
  });

  if(!employee) {
    throw new ApiError(404, "Employee Not Found")
  }

  const isPasswordValid = await employee.isPasswordCorrect(password);
  if(!isPasswordValid) {
    throw new ApiError(401, "Password is Incorrect")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
    employee._id
  );

  const loggedInEmployee = await Employee.findById(employee._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToke", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInEmployee,
          accessToken,
          refreshToken
        },
        "Employee Loged In Successfull"
      )
    )

})


const logoutEmployee = asyncHandler(async (req, res) => {
    await Employee.findByIdAndUpdate(
      req.employee._id,
      {
        $set: {
          refreshToken : undefined
        }
      },
      {
        new: true
      }
    )
     const option = {
      httpOnly: true,
      secure: true
    };
    return res 
    .status(200)
    .clearCookie('accessToken', option)
    .clearCookie('refreshToken', option)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});


export {
   registerEmployee,
   loginEmployee,
   logoutEmployee
  };
