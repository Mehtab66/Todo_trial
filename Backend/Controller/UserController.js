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

    // Fetch tasks where isDeleted is false, and sort them by createdAt in descending order (newest first)
    const tasks = await Task.find({ userId, isDeleted: { $ne: true } }).sort({
      createdAt: -1,
    });

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

module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID and mark it as deleted
    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Fetch a single task by ID
module.exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
module.exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, auth0Id } = req.body;

//     // Check if user already exists (by email for manual, by auth0Id for Auth0 users)
//     const existingUser = await User.findOne(auth0Id ? { auth0Id } : { email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = password
//       ? await bcrypt.hash(password, 10)
//       : undefined;

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       auth0Id: auth0Id || null, // Ensure null if not provided
//     });

//     await newUser.save();
//     const token = generateToken(newUser);
//     res.status(201).json({ token, user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, auth0Id } = req.body;

    // Ensure uniqueness by checking both email & auth0Id
    const existingUser = await User.findOne({
      $or: [{ email }, { auth0Id }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password only if manually signing up
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const newUser = new User({
      name,
      email,
      password: hashedPassword || null, // Store null if no password (Auth0 user)
      auth0Id: auth0Id || null, // Store null if no auth0Id (manual user)
    });

    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// module.exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log(email, password);
//     const user = await User.findOne({ email });
//     console.log(user, "hello user");
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("is not match");
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = generateToken(user);
//     res.status(200).json({ token, user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });
    console.log(user, "hello user");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If user is from Google (auth0Id exists), don't check password
    if (user.auth0Id) {
      return res.status(400).json({ message: "Please log in using Google" });
    }

    // If the user has a password, compare it
    if (!user.password) {
      return res
        .status(400)
        .json({ message: "No password found. Use Google login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
