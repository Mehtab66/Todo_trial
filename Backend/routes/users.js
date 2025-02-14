var express = require("express");
var router = express.Router();
const Controller = require("../Controller/UserController");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/users", Controller.checkUser);

router.get("/tasks", Controller.getTasks);
module.exports = router;
