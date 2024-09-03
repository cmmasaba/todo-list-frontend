// src/Login.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Monitor user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Handle user signup
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get the Firebase ID token
      await sendTokenToBackend(token); // Send token to backend
      alert("Signup successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get the Firebase ID token
      await sendTokenToBackend(token); // Send token to backend
      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      setUser(null); // Clear the user state
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to send the token to the backend
  const sendTokenToBackend = async (token) => {
    try {
      const response = await axios.post('http://your-fastapi-backend-url/auth/verify-token', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Token verification response:", response.data);
    } catch (error) {
      console.error("Error sending token to backend:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {user ? `Welcome, ${user.email}` : "Login or Signup"}
        </h1>
        <div className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!user ? (
            <>
              <button
                onClick={handleSignup}
                className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Sign Up
              </button>
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Login
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
