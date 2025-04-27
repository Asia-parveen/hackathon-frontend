import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const myapiUrl = import.meta.env.VITE_API_URL;

// TaskCard Component: Displays individual task details
const TaskCard = ({ task, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-4 mb-3 rounded-md shadow-md">
      <h4 className="font-semibold">{task.title}</h4>
      <p>{task.description}</p>
      <p className="text-sm text-gray-500">Assigned: {task.assignedTo}</p>
      <p className="text-sm text-gray-500">Status: {task.status}</p>
      <button onClick={() => onDelete(task._id)} className="bg-red-500 text-white py-1 px-3 rounded-md">Delete</button>
      <button onClick={() => onEdit(task)} className="bg-blue-500 text-white py-1 px-3 rounded-md ml-2">Edit</button>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'todo', // Default status is 'todo'
  });

  useEffect(() => {
    fetchTasks();  // Fetch tasks on page load
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('${ myapiUrl}/api/tasks'); // Ensure the URL is correct
      const tasksData = response.data;
      const categorizedTasks = categorizeTasks(tasksData);
      setTasks(categorizedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const categorizeTasks = (tasks) => {
    const categorized = { todo: [], inProgress: [], done: [] };
    tasks.forEach((task) => {
      categorized[task.status].push(task);
    });
    return categorized;
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const [removed] = tasks[source.droppableId].splice(source.index, 1);
    tasks[destination.droppableId].splice(destination.index, 0, removed);

    const updatedTask = { ...removed, status: destination.droppableId };
    try {
      await axios.put(`${ myapiUrl}/api/tasks/${updatedTask._id}`, updatedTask); // Ensure correct URL
      fetchTasks();  // Refresh tasks after drag-and-drop update
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${ myapiUrl }/api/tasks', newTask); // Ensure correct URL
      const createdTask = response.data;

      setTasks((prev) => {
        const updatedTasks = { ...prev };
        updatedTasks[newTask.status].push(createdTask); // Add to the correct status column
        return updatedTasks;
      });

      setNewTask({ title: '', description: '', assignedTo: '', status: 'todo' }); // Reset form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${ myapiUrl }/api/tasks/${taskId}`); // Ensure correct URL
      fetchTasks(); // Refresh tasks after delete
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({ ...task });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Task Management</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} className="mb-6">
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Task Title"
          className="p-2 rounded-md border mb-3 w-full"
          required
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="p-2 rounded-md border mb-3 w-full"
          required
        />
        <input
          type="text"
          name="assignedTo"
          value={newTask.assignedTo}
          onChange={handleInputChange}
          placeholder="Assigned To"
          className="p-2 rounded-md border mb-3 w-full"
          required
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleInputChange}
          className="p-2 rounded-md border mb-3 w-full"
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Add Task
        </button>
      </form>

      {/* Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8">
          {['todo', 'inProgress', 'done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-${status === 'todo' ? 'blue' : status === 'inProgress' ? 'yellow' : 'green'}-100 p-4 rounded-md w-1/3`}
                >
                  <h3 className="text-2xl font-semibold mb-4 capitalize">
                    {status.replace(/([A-Z])/g, ' $1')}
                  </h3>
                  {tasks[status].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 mb-3 rounded-md shadow-md"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <TaskCard task={task} onDelete={handleDeleteTask} onEdit={handleEditTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
















// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState({
//     todo: [],
//     inProgress: [],
//     done: [],
//   });

//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     assignedTo: "",
//     status: "todo", // Default status is To Do
//   });

//   useEffect(() => {
//     fetchTasks(); // Fetch tasks on initial load
//   }, []);

//   // Fetch tasks from the API
//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/tasks");
//       const tasksData = response.data;
//       const categorizedTasks = categorizeTasks(tasksData);
//       setTasks(categorizedTasks);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   // Categorize tasks based on their status
//   const categorizeTasks = (tasks) => {
//     const categorized = {
//       todo: [],
//       inProgress: [],
//       done: [],
//     };
//     tasks.forEach((task) => {
//       categorized[task.status].push(task);
//     });
//     return categorized;
//   };

//   // Create new task
//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/tasks", newTask);
//       setNewTask({ title: "", description: "", assignedTo: "", status: "todo" });
//       fetchTasks(); // Refresh tasks
//     } catch (error) {
//       console.error("Error creating task:", error);
//     }
//   };

//   // Handle drag-and-drop events
//   const handleDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return; // Dropped outside the list

//     const [removed] = tasks[source.droppableId].splice(source.index, 1);
//     tasks[destination.droppableId].splice(destination.index, 0, removed);

//     // Update task status after drag-and-drop
//     const updatedTask = { ...removed, status: destination.droppableId };
//     try {
//       await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask);
//       fetchTasks(); // Refresh tasks
//     } catch (error) {
//       console.error("Error updating task status:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-6">TaskBoard</h1>

//       {/* Task Creation Form */}
//       <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-md shadow-lg mb-6">
//         <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={newTask.title}
//           onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//           required
//           className="w-full p-3 border border-gray-300 rounded-lg mb-3"
//         />
//         <textarea
//           placeholder="Task Description"
//           value={newTask.description}
//           onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//           required
//           className="w-full p-3 border border-gray-300 rounded-lg mb-3"
//         />
//         <input
//           type="text"
//           placeholder="Assigned To"
//           value={newTask.assignedTo}
//           onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
//           required
//           className="w-full p-3 border border-gray-300 rounded-lg mb-3"
//         />
//         <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//           Create Task
//         </button>
//       </form>

//       {/* Task Board */}
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex gap-8">
//           {/* To Do Column */}
//           <Droppable droppableId="todo">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-blue-100 p-4 rounded-md w-1/3"
//               >
//                 <h3 className="text-2xl font-semibold mb-4">To Do</h3>
//                 {tasks.todo.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-md shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600">Assigned to: {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>

//           {/* In Progress Column */}
//           <Droppable droppableId="inProgress">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-yellow-100 p-4 rounded-md w-1/3"
//               >
//                 <h3 className="text-2xl font-semibold mb-4">In Progress</h3>
//                 {tasks.inProgress.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-md shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600">Assigned to: {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>

//           {/* Done Column */}
//           <Droppable droppableId="done">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-green-100 p-4 rounded-md w-1/3"
//               >
//                 <h3 className="text-2xl font-semibold mb-4">Done</h3>
//                 {tasks.done.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-md shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600">Assigned to: {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default TaskBoard;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState({
//     todo: [],
//     inProgress: [],
//     done: [],
//   });

//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     assignedTo: '',
//     status: 'todo',  // Default status
//   });

//   useEffect(() => {
//     // Fetch tasks when the component mounts
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/tasks'); // Replace with your API endpoint
//       const tasksData = response.data;
//       const categorizedTasks = categorizeTasks(tasksData);
//       setTasks(categorizedTasks);
//     } catch (error) {
//       console.error('Error fetching tasks', error);
//     }
//   };

//   const categorizeTasks = (tasks) => {
//     const categorized = {
//       todo: [],
//       inProgress: [],
//       done: [],
//     };
//     tasks.forEach((task) => {
//       categorized[task.status].push(task);
//     });
//     return categorized;
//   };

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/tasks', newTask); // Replace with your API endpoint
//       setNewTask({ title: '', description: '', assignedTo: '', status: 'todo' });  // Reset form
//       fetchTasks();  // Refresh tasks
//     } catch (error) {
//       console.error('Error creating task', error);
//     }
//   };

//   const handleDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;  // Dropped outside the list

//     const [removed] = tasks[source.droppableId].splice(source.index, 1);
//     tasks[destination.droppableId].splice(destination.index, 0, removed);

//     // Update task status after drag
//     const updatedTask = { ...removed, status: destination.droppableId };
//     try {
//       await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask); // Replace with your API endpoint
//       fetchTasks(); // Refresh tasks
//     } catch (error) {
//       console.error('Error updating task status', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Task Management</h1>

//       <form onSubmit={handleCreateTask} className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={newTask.title}
//           onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//           required
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <textarea
//           placeholder="Task Description"
//           value={newTask.description}
//           onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//           required
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <input
//           type="text"
//           placeholder="Assigned To"
//           value={newTask.assignedTo}
//           onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
//           required
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
//         >
//           Create Task
//         </button>
//       </form>

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="flex space-x-6">
//           {/* To Do Column */}
//           <Droppable droppableId="todo">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-gray-100 p-4 rounded-lg shadow-md w-80"
//               >
//                 <h3 className="text-xl font-semibold mb-4">To Do</h3>
//                 {tasks.todo.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-lg shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600"><strong>Assigned to:</strong> {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>

//           {/* In Progress Column */}
//           <Droppable droppableId="inProgress">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-gray-100 p-4 rounded-lg shadow-md w-80"
//               >
//                 <h3 className="text-xl font-semibold mb-4">In Progress</h3>
//                 {tasks.inProgress.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-lg shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600"><strong>Assigned to:</strong> {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>

//           {/* Done Column */}
//           <Droppable droppableId="done">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-gray-100 p-4 rounded-lg shadow-md w-80"
//               >
//                 <h3 className="text-xl font-semibold mb-4">Done</h3>
//                 {tasks.done.map((task, index) => (
//                   <Draggable key={task._id} draggableId={task._id} index={index}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="bg-white p-4 mb-3 rounded-lg shadow-md"
//                         style={{ ...provided.draggableProps.style }}
//                       >
//                         <h4 className="font-semibold">{task.title}</h4>
//                         <p>{task.description}</p>
//                         <p className="mt-2 text-gray-600"><strong>Assigned to:</strong> {task.assignedTo}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default TaskBoard;


