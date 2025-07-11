import express from 'express';
const router = express.Router();
import { registerEmployee } from '../controllers/employee.controller.js'
// const router = Router();
// import {verifyJWT} from "../middlewares/auth.middleware"


// router.route("/register").post( function (){
//     console.log("usr fuvnfd")
// });

router.route("/register").post(registerEmployee);

export default router;



// POST /api/employee/register
// router.post('/register', (req, res) => {
//     // Implement registration logic here
//     res.status(201).json({ message: 'Employee registered successfully' });
// });

// export default router;