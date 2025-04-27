import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ fetchTasks }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo", // Default status is "To Do"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", newTask);
      setNewTask({ title: "", description: "", assignedTo: "", status: "todo" });
      fetchTasks(); // Refresh tasks after creating
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg mb-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
      />
      <textarea
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
      />
      <input
        type="text"
        placeholder="Assigned To"
        value={newTask.assignedTo}
        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-lg mb-3"
      />
      <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;

