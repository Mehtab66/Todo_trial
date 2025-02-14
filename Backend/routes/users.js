var express = require("express");
var router = express.Router();
const Controller = require("../Controller/UserController");
const { checkJwt } = require("../Middleware/isLoggedIn");
router.post("/users", Controller.checkUser);

router.get("/tasks", checkJwt, Controller.getTasks);
router.post("/task", checkJwt, Controller.addTask);
router.delete("/task/:id", checkJwt, Controller.deleteTask);
// router.put("/tasks/:id", Controller.updateTask);

// Fetch single task
router.get("/task/:id", checkJwt, Controller.getTaskById);

// Update task
router.patch("/task/:id", checkJwt, Controller.updateTask);

// router.post("/register", Controller.registerUser);
// router.post("/login", Controller.loginUser);
module.exports = router;
