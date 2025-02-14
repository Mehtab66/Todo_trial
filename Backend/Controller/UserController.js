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
  try {
    const { userId } = req.query;
    // Fetch tasks and sort them by createdAt in descending order (newest first)
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

//addTask
module.exports.addTask = async (req, res) => {
  try {
    const { userId, name, description, status } = req.body;
    console.log(userId, name, description, status);
    const newTask = new Task({
      userId,
      name,
      description,
      status,
    });
    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add task" });
  }
};
