import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { auth } from './firebase';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const response = await axios.get('/todos');
          setTodos(response.data);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await axios.post('/todos', { title: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo('');
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await axios.delete(`/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const handleEditTodo = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await axios.put(`/todos/${id}`, { title: editedTitle });
        setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
        setEditingTodo(null);
        setEditedTitle('');
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleGetTodo = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await axios.get(`/todos/${id}`);
        console.log(response.data); // Handle the single todo as needed
      } catch (error) {
        console.error("Error fetching single todo:", error);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">Your ToDo List</h1>
        
        {/* Add New Todo */}
        <div className="flex space-x-4">
          <input
            type="text"
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="mt-6 space-y-4">
          {todos.map(todo => (
            <li key={todo.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow">
              {editingTodo === todo.id ? (
                <>
                  <input
                    type="text"
                    className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditTodo(todo.id)}
                    className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-800">{todo.title}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingTodo(todo.id);
                        setEditedTitle(todo.title);
                      }}
                      className="px-4 py-2 font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
