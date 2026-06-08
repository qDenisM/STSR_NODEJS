const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
 
userRouter.post("/create", userController.addUser);
userRouter.get("/", userController.getUsers);
userRouter.get('/:id', userController.getUser)
 
module.exports = userRouter;