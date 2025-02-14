import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth0();

  const [task, setTask] = useState({
    name: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    // Fetch the task details
    fetch(`http://localhost:3000/todo/task/${id}`)
      .then((res) => res.json())
      .then((data) => setTask(data.task || {}))
      .catch((error) => console.error("Error fetching task:", error));
  }, [id]);

  // Update task function
  const updateTask = async () => {
    const response = await fetch(`http://localhost:3000/todo/task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      navigate("/dashboard"); // Redirect after update
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* User Info Section */}
      <div className="w-full bg-white shadow-lg rounded-xl p-6 text-center mb-6">
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

      {/* Edit Task Section */}
      <div className="w-full  bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Edit Task
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task Title..."
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Task Description..."
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-between">
            <button
              onClick={updateTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-50"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition w-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
