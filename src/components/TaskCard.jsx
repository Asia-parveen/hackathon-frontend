import React from "react";

const TaskCard = ({ task, fetchTasks }) => {
  return (
    <div className="task-card">
      <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => deleteTask(task._id, fetchTasks)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const deleteTask = async (id, fetchTasks) => {
  try {
    await axios.delete(`/api/tasks/${id}`);
    fetchTasks(); // Refresh tasks after deletion
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export default TaskCard;

