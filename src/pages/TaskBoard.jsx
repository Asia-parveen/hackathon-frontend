import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const myapiUrl = import.meta.env.VITE_API_URL;

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${myapiUrl}/api/tasks`);
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: 'Unassigned',
      status: 'todo',
    };

    try {
      await axios.post(`${myapiUrl}/api/tasks`, newTask);
      setNewTaskTitle('');
      setNewTaskDescription('');
      fetchTasks();
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error creating task!');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${myapiUrl}/api/tasks/${id}`);
      fetchTasks();
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error deleting task!');
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      await axios.put(`${myapiUrl}/api/tasks/${id}`, updatedFields);
      fetchTasks();
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task!');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description);
  };

  const handleEditSubmit = async (id) => {
    if (editedTaskTitle.trim() === '') return;
    await updateTask(id, { title: editedTaskTitle, description: editedTaskDescription });
    setEditingTaskId(null);
    setEditedTaskTitle('');
    setEditedTaskDescription('');
  };

  const markAsDone = async (task) => {
    await updateTask(task._id, { status: 'done' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Mern Stack Task Management App</h1>

        {/* Create Task Form */}
        <form onSubmit={createTask} className="flex flex-col mb-8">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter a new task title..."
            className="p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700 mb-4"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Enter task description..."
            className="p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700 mb-4"
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-xl transition"
          >
            Add Task
          </button>
        </form>

        {/* Task List */}
        <ul className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks yet! Start adding some 🚀</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg shadow-md transition ${
                  task.status === 'done' ? 'bg-green-100' : 'bg-purple-100'
                }`}
              >
                <div
                  className={`flex-1 mb-4 sm:mb-0 sm:mr-4 text-lg ${
                    task.status === 'done' ? 'line-through text-green-600' : 'text-purple-700'
                  }`}
                >
                  {editingTaskId === task._id ? (
                    <div>
                      <input
                        type="text"
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                        className="border p-2 rounded-lg w-full mb-2"
                      />
                      <textarea
                        value={editedTaskDescription}
                        onChange={(e) => setEditedTaskDescription(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p>{task.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {editingTaskId === task._id ? (
                    <button
                      onClick={() => handleEditSubmit(task._id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full text-sm w-full sm:w-auto transition"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {task.status !== 'done' && (
                        <button
                          onClick={() => markAsDone(task)}
                          className="bg-green-400 hover:bg-green-500 text-white font-semibold px-6 py-2 md:py-[5px] rounded-full text-sm w-full sm:w-auto transition"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 md:py-[5px] rounded-full text-sm w-full sm:w-auto transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-400 hover:bg-red-500 text-white font-semibold px-6 py-2 md:py-[5px] rounded-full text-sm w-full sm:w-auto transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default TaskBoard;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

// const myapiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [newTaskDescription, setNewTaskDescription] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTaskTitle, setEditedTaskTitle] = useState('');
//   const [editedTaskDescription, setEditedTaskDescription] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       console.log('API URL:', `${myapiUrl}/api/tasks`); // Log the API URL to verify
//       const response = await axios.get(`${myapiUrl}/api/tasks`);
//       console.log('Fetched tasks:', response.data);  // Log the data received from the API
//       if (response.data && Array.isArray(response.data)) {
//         setTasks(response.data);  // Ensure that the data is an array
//       } else {
//         console.error('Unexpected data format:', response.data);  // Log unexpected data format
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error);  // Log error if fetching fails
//     }
//   };
  
  

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: newTaskDescription,
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       const response = await axios.post(`${myapiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       setNewTaskDescription('');
//       fetchTasks();
//       toast.success('Task created successfully!');
//       console.log('Task created:', newTask);  // Log the new task creation
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Error creating task!');
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${myapiUrl}/api/tasks/${id}`);
//       fetchTasks();
//       toast.success('Task deleted successfully!');
//       console.log('Task deleted:', id);  // Log the task deletion
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       toast.error('Error deleting task!');
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${myapiUrl}/api/tasks/${id}`, updatedFields);
//       fetchTasks();
//       toast.success('Task updated successfully!');
//       console.log('Task updated:', id, updatedFields);  // Log task update
//     } catch (error) {
//       console.error('Error updating task:', error);
//       toast.error('Error updating task!');
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditedTaskTitle(task.title);
//     setEditedTaskDescription(task.description);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editedTaskTitle.trim() === '') return;
//     await updateTask(id, { title: editedTaskTitle, description: editedTaskDescription });
//     setEditingTaskId(null);
//     setEditedTaskTitle('');
//     setEditedTaskDescription('');
//   };

//   const markAsDone = async (task) => {
//     await updateTask(task._id, { status: 'done' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
//       <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
//         <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Mern Stack Task Management App</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex flex-col mb-8">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter a new task title..."
//             className="p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700 mb-4"
//           />
//           <textarea
//             value={newTaskDescription}
//             onChange={(e) => setNewTaskDescription(e.target.value)}
//             placeholder="Enter task description..."
//             className="p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700 mb-4"
//           />
//           <button
//             type="submit"
//             className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-xl transition"
//           >
//             Add Task
//           </button>
//         </form>

//         {/* Task List */}
//         <ul className="space-y-4">
//           {tasks.length === 0 ? (
//             <p className="text-center text-gray-500">No tasks yet! Start adding some 🚀</p>
//           ) : (
//             tasks.map((task) => (
//               <li
//                 key={task._id}
//                 className={`flex items-center justify-between p-4 rounded-lg shadow-md transition ${
//                   task.status === 'done' ? 'bg-green-100' : 'bg-purple-100'
//                 }`}
//               >
//                 <div
//                   className={`flex-1 mr-4 text-lg ${
//                     task.status === 'done' ? 'line-through text-green-600' : 'text-purple-700'
//                   }`}
//                 >
//                   {editingTaskId === task._id ? (
//                     <div>
//                       <input
//                         type="text"
//                         value={editedTaskTitle}
//                         onChange={(e) => setEditedTaskTitle(e.target.value)}
//                         className="border p-2 rounded-lg w-full mb-2"
//                       />
//                       <textarea
//                         value={editedTaskDescription}
//                         onChange={(e) => setEditedTaskDescription(e.target.value)}
//                         className="border p-2 rounded-lg w-full"
//                       />
//                     </div>
//                   ) : (
//                     <div>
//                       <h3 className="font-semibold">{task.title}</h3>
//                       <p>{task.description}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   {editingTaskId === task._id ? (
//                     <button
//                       onClick={() => handleEditSubmit(task._id)}
//                       className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       {task.status !== 'done' && (
//                         <button
//                           onClick={() => markAsDone(task)}
//                           className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
//                         >
//                           Done
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleEdit(task)}
//                         className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteTask(task._id)}
//                         className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
//                       >
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </li>
//             ))
//           )}
//         </ul>
//       </div>

//       {/* ToastContainer */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default TaskBoard;





