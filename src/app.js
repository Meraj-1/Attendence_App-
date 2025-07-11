import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


import EmployeeRouter from './routes/Employee.route.js'


app.use('/api/employee', EmployeeRouter);

export default app;