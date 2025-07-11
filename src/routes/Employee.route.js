import express from 'express';
const router = express.Router();
import { 
    loginEmployee,
    logoutEmployee,
    registerEmployee
 } from '../controllers/employee.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';








router.route("/register").post(registerEmployee);
router.route("/login").post(loginEmployee)



router.route('/logout').post(verifyJWT, logoutEmployee)


export default router;


