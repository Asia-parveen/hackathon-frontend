import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

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
      setTasks(response.data);
      console.log('Fetched tasks:', response.data);  // Log the fetched tasks
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
      const response = await axios.post(`${myapiUrl}/api/tasks`, newTask);
      setNewTaskTitle('');
      setNewTaskDescription('');
      fetchTasks();
      toast.success('Task created successfully!');
      console.log('Task created:', newTask);  // Log the new task creation
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
      console.log('Task deleted:', id);  // Log the task deletion
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
      console.log('Task updated:', id, updatedFields);  // Log task update
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
                className={`flex items-center justify-between p-4 rounded-lg shadow-md transition ${
                  task.status === 'done' ? 'bg-green-100' : 'bg-purple-100'
                }`}
              >
                <div
                  className={`flex-1 mr-4 text-lg ${
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

                <div className="flex gap-2">
                  {editingTaskId === task._id ? (
                    <button
                      onClick={() => handleEditSubmit(task._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {task.status !== 'done' && (
                        <button
                          onClick={() => markAsDone(task)}
                          className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold"
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

// const apiUrl = import.meta.env.VITE_API_URL;

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
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
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
//       const response = await axios.post(`${apiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       setNewTaskDescription('');
//       fetchTasks();
//       toast.success('Task created successfully!');
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Error creating task!');
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       fetchTasks();
//       toast.success('Task deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       toast.error('Error deleting task!');
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedFields);
//       fetchTasks();
//       toast.success('Task updated successfully!');
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




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

// const apiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTaskTitle, setEditedTaskTitle] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: 'No description',
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       const response = await axios.post(`${apiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       fetchTasks();
//       toast.success('Task created successfully!');  // Toast notification for task creation
//       console.log('Task Created Successfully:', response.data);  // Console log on task creation
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Error creating task!');
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       fetchTasks();
//       toast.success('Task deleted successfully!');  // Toast notification for task deletion
//       console.log(`Task Deleted: ID ${id}`);  // Console log on delete
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       toast.error('Error deleting task!');
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedFields);
//       fetchTasks();
//       toast.success('Task updated successfully!');  // Toast notification for task update
//       console.log('Task Updated:', { id, updatedFields });  // Console log on update
//     } catch (error) {
//       console.error('Error updating task:', error);
//       toast.error('Error updating task!');
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditedTaskTitle(task.title);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editedTaskTitle.trim() === '') return;
//     await updateTask(id, { title: editedTaskTitle });
//     setEditingTaskId(null);
//     setEditedTaskTitle('');
//   };

//   const markAsDone = async (task) => {
//     await updateTask(task._id, { status: 'done' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
//       <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
//         <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Mern Stack Task Management App</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex mb-8">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter a new task..."
//             className="flex-1 p-3 border-2 border-purple-300 rounded-l-xl focus:outline-none focus:border-purple-500 text-gray-700"
//           />
//           <button
//             type="submit"
//             className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 rounded-r-xl transition"
//           >
//             Add
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
//                     <input
//                       type="text"
//                       value={editedTaskTitle}
//                       onChange={(e) => setEditedTaskTitle(e.target.value)}
//                       className="border p-2 rounded-lg w-full"
//                     />
//                   ) : (
//                     task.title
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



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';  // Import Toastify CSS

// const apiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTaskTitle, setEditedTaskTitle] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: 'No description',
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       const response = await axios.post(`${apiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       fetchTasks();
//       toast.success('Task created successfully!');  // Toast notification for task creation
//     } catch (error) {
//       console.error('Error creating task:', error);
//       toast.error('Error creating task!');
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       fetchTasks();
//       toast.success('Task deleted successfully!');  // Toast notification for task deletion
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       toast.error('Error deleting task!');
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedFields);
//       fetchTasks();
//       toast.success('Task updated successfully!');  // Toast notification for task update
//     } catch (error) {
//       console.error('Error updating task:', error);
//       toast.error('Error updating task!');
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditedTaskTitle(task.title);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editedTaskTitle.trim() === '') return;
//     await updateTask(id, { title: editedTaskTitle });
//     setEditingTaskId(null);
//     setEditedTaskTitle('');
//   };

//   const markAsDone = async (task) => {
//     await updateTask(task._id, { status: 'done' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
//       <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
//         <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Mern Stack Task Mangment App</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex mb-8">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter a new task..."
//             className="flex-1 p-3 border-2 border-purple-300 rounded-l-xl focus:outline-none focus:border-purple-500 text-gray-700"
//           />
//           <button
//             type="submit"
//             className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 rounded-r-xl transition"
//           >
//             Add
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
//                     <input
//                       type="text"
//                       value={editedTaskTitle}
//                       onChange={(e) => setEditedTaskTitle(e.target.value)}
//                       className="border p-2 rounded-lg w-full"
//                     />
//                   ) : (
//                     task.title
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




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTaskTitle, setEditedTaskTitle] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: 'No description',
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       const response = await axios.post(`${apiUrl}/api/tasks`, newTask);
//       console.log('Task Created Successfully:', response.data); // ✅ Console log after creating task
//       setNewTaskTitle('');
//       fetchTasks();
//     } catch (error) {
//       console.error('Error creating task:', error);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       console.log(`Task Deleted: ID ${id}`); // ✅ Console log on delete
//       fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedFields);
//       console.log('Task Updated:', { id, updatedFields }); // ✅ Console log on update
//       fetchTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditedTaskTitle(task.title);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editedTaskTitle.trim() === '') return;
//     await updateTask(id, { title: editedTaskTitle });
//     setEditingTaskId(null);
//     setEditedTaskTitle('');
//   };

//   const markAsDone = async (task) => {
//     await updateTask(task._id, { status: 'done' });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
//       <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
//         <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">🌟 My To-Do List 🌟</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex mb-8">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter a new task..."
//             className="flex-1 p-3 border-2 border-purple-300 rounded-l-xl focus:outline-none focus:border-purple-500 text-gray-700"
//           />
//           <button
//             type="submit"
//             className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 rounded-r-xl transition"
//           >
//             Add
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
//                     <input
//                       type="text"
//                       value={editedTaskTitle}
//                       onChange={(e) => setEditedTaskTitle(e.target.value)}
//                       className="border p-2 rounded-lg w-full"
//                     />
//                   ) : (
//                     task.title
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
//     </div>
//   );
// };

// export default TaskBoard;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTaskTitle, setEditedTaskTitle] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: 'No description',
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       await axios.post(`${apiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       fetchTasks();
//     } catch (error) {
//       console.error('Error creating task:', error);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const updateTask = async (id, updatedFields) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedFields);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditedTaskTitle(task.title);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editedTaskTitle.trim() === '') return;
//     await updateTask(id, { title: editedTaskTitle });
//     setEditingTaskId(null);
//     setEditedTaskTitle('');
//   };

//   const markAsDone = async (task) => {
//     await updateTask(task._id, { status: 'done' });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">My To-Do List</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex mb-6">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter new task..."
//             className="flex-1 p-2 border rounded-l-lg focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
//           >
//             Add
//           </button>
//         </form>

//         {/* Task List */}
//         <ul>
//           {tasks.length === 0 ? (
//             <p className="text-center text-gray-500">No tasks yet!</p>
//           ) : (
//             tasks.map((task) => (
//               <li
//                 key={task._id}
//                 className={`flex justify-between items-center p-3 mb-2 rounded-md shadow-sm ${
//                   task.status === 'done' ? 'bg-green-100' : 'bg-blue-100'
//                 }`}
//               >
//                 <div
//                   className={`flex-1 ${
//                     task.status === 'done' ? 'line-through text-green-700' : 'text-blue-700'
//                   }`}
//                 >
//                   {editingTaskId === task._id ? (
//                     <input
//                       type="text"
//                       value={editedTaskTitle}
//                       onChange={(e) => setEditedTaskTitle(e.target.value)}
//                       className="border p-1 rounded"
//                     />
//                   ) : (
//                     task.title
//                   )}
//                 </div>
//                 <div className="flex gap-2 ml-2">
//                   {editingTaskId === task._id ? (
//                     <button
//                       onClick={() => handleEditSubmit(task._id)}
//                       className="text-green-500 hover:text-green-700"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       {task.status !== 'done' && (
//                         <button
//                           onClick={() => markAsDone(task)}
//                           className="text-green-500 hover:text-green-700"
//                         >
//                           Done
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleEdit(task)}
//                         className="text-yellow-500 hover:text-yellow-700"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteTask(task._id)}
//                         className="text-red-500 hover:text-red-700"
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
//     </div>
//   );
// };

// export default TaskBoard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL;

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editingTaskTitle, setEditingTaskTitle] = useState('');

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (newTaskTitle.trim() === '') return;

//     const newTask = {
//       title: newTaskTitle,
//       description: 'No description',
//       assignedTo: 'Unassigned',
//       status: 'todo',
//     };

//     try {
//       await axios.post(`${apiUrl}/api/tasks`, newTask);
//       setNewTaskTitle('');
//       fetchTasks();
//     } catch (error) {
//       console.error('Error creating task:', error);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/tasks/${id}`);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const updateTask = async (id, updatedData) => {
//     try {
//       await axios.put(`${apiUrl}/api/tasks/${id}`, updatedData);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   const handleEdit = (task) => {
//     setEditingTaskId(task._id);
//     setEditingTaskTitle(task.title);
//   };

//   const handleEditSubmit = async (id) => {
//     if (editingTaskTitle.trim() === '') return;

//     await updateTask(id, { title: editingTaskTitle });
//     setEditingTaskId(null);
//     setEditingTaskTitle('');
//   };

//   const handleToggleStatus = async (task) => {
//     const newStatus = task.status === 'done' ? 'todo' : 'done';
//     await updateTask(task._id, { status: newStatus });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-200 to-pink-200 p-6">
//       <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-8">
//         <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">My To-Do Management</h1>

//         {/* Create Task Form */}
//         <form onSubmit={createTask} className="flex mb-8">
//           <input
//             type="text"
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             placeholder="Enter new task..."
//             className="flex-1 p-3 border-2 border-indigo-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//           <button
//             type="submit"
//             className="bg-indigo-500 text-white px-6 rounded-r-lg hover:bg-indigo-600"
//           >
//             Add
//           </button>
//         </form>

//         {/* Task List */}
//         <ul>
//           {tasks.length === 0 ? (
//             <p className="text-center text-gray-500">No tasks yet!</p>
//           ) : (
//             tasks.map((task) => (
//               <li
//                 key={task._id}
//                 className={`flex justify-between items-center p-4 mb-4 rounded-lg shadow-md transition ${
//                   task.status === 'done'
//                     ? 'bg-green-100'
//                     : 'bg-blue-100'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={task.status === 'done'}
//                     onChange={() => handleToggleStatus(task)}
//                     className="h-5 w-5 text-green-500"
//                   />
//                   {editingTaskId === task._id ? (
//                     <input
//                       type="text"
//                       value={editingTaskTitle}
//                       onChange={(e) => setEditingTaskTitle(e.target.value)}
//                       className="p-1 border-b-2 border-indigo-400 bg-transparent focus:outline-none"
//                     />
//                   ) : (
//                     <span
//                       className={`text-lg ${
//                         task.status === 'done' ? 'line-through text-green-700' : 'text-blue-800'
//                       }`}
//                     >
//                       {task.title}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   {editingTaskId === task._id ? (
//                     <button
//                       onClick={() => handleEditSubmit(task._id)}
//                       className="text-green-600 font-semibold hover:underline"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(task)}
//                       className="text-indigo-500 hover:underline font-semibold"
//                     >
//                       Edit
//                     </button>
//                   )}

//                   <button
//                     onClick={() => deleteTask(task._id)}
//                     className="text-red-500 hover:underline font-semibold"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </li>
//             ))
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TaskBoard;





