import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch user tasks from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`http://localhost:3000/todo/tasks?userId=${user.sub}`)
        .then((res) => res.json())
        .then((data) => setTasks(data.tasks || ""))
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [isAuthenticated, user?.sub]);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    const response = await fetch("http://localhost:3000/todo/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.sub, title: newTask }),
    });
    const data = await response.json();
    setTasks([...tasks, data.task]);
    setNewTask("");
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    await fetch(`http://localhost:3000/todo/tasks/${taskId}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* User Info Section */}
      <div className="w-full  bg-white shadow-lg rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-600">{user?.email}</p>
        <button
          onClick={() => logout()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Task Management Section */}
      <div className="w-full  bg-white shadow-lg rounded-xl mt-6 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>

        {/* Task Input */}
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="New Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 border rounded-l-md focus:outline-none"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="mt-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet!</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-md mt-2 shadow"
              >
                <span className="text-gray-700">{task.title}</span>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
