import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Edit Task
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task Title..."
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none"
          />
          <textarea
            placeholder="Task Description..."
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none"
          />
          <select
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-between">
            <button
              onClick={updateTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-1/2"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition w-1/2"
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
