require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRoute = require('./route/userRoute')
const postRoute = require('./route/postRoute')
const commentRoute = require('./route/commentRoute')
const questionRoute = require('./route/questionRoute')
const userManagementRoute = require('./route/UserManagementRoute')
const layoutRoute = require('./route/layoutRoute')

const app = express()

const allowedOrigins = [
    "https://apostolicanswers.netlify.app", // Main domain
   "https://67c49fde395ea3290c745a76--apostolicanswers.netlify.app", // Temporary deploy preview
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // If using cookies or authentication
    })
  );

app.use(express.json())
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use('/user', userRoute);
app.use('/manage', userManagementRoute);
app.use('/post', postRoute);
app.use('/comments', commentRoute);
app.use('/question',questionRoute)
app.use('/layout',layoutRoute)



mongoose.connect(process.env.MONGO_URI)
.then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
.catch(err => console.error('MongoDB connection error:', err));
