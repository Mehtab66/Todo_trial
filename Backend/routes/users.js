var express = require("express");
var router = express.Router();
const Controller = require("../Controller/UserController");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/users", Controller.checkUser);

router.get("/tasks", Controller.getTasks);
router.post("/task", addTask);
router.delete("/task/:id", deleteTask);
router.put("/tasks/:id", updateTask);
module.exports = router;
