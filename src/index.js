import dotenv from 'dotenv';
// import express from 'express';
import connectDB from './db/index.js';
import app from './app.js';
dotenv.config();
// const app = express();

connectDB()
.then(() => {
    app.listen(3000, () => {
       console.log('====================================');
       console.log("Server is running on port 3000");
       console.log('====================================');
    })
})
.catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit process with failure
});