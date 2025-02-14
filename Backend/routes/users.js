var express = require("express");
var router = express.Router();
const Controller = require("../Controller/UserController");

router.post("/users", Controller.checkUser);

router.get("/tasks", Controller.getTasks);
router.post("/task", Controller.addTask);
router.delete("/task/:id", Controller.deleteTask);
// router.put("/tasks/:id", Controller.updateTask);

// Fetch single task
router.get("/task/:id", Controller.getTaskById);

// Update task
router.patch("/task/:id", Controller.updateTask);

module.exports = router;
