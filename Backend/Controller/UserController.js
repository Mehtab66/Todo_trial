const User = require("../Models/User");
const Task = require("../Models/Task");
module.exports.checkUser = async (req, res) => {
  const { auth0Id, email, name } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (user) {
      console.log(user);
      console.log("User already exists");
      return res.status(200).json({ message: "User already exists", user });
    }

    user = new User({ auth0Id, email, name });
    console.log("User created");
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get all tasks
module.exports.getTasks = async (req, res) => {
  const { userId } = req.query;
  console.log(userId, "user id man");
  const tasks = await Task.find({ userId });
  res.json({ tasks });
};
