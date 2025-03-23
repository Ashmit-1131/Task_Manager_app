// src/pages/TasksPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
// import Navbar from '../components/Navbar'; 
import './TasksPage.css'; 

// For now, TasksPage is a placeholder for authenticated users.
const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="tasks-container">
      <h2>Welcome, {user?.displayName || 'User'}!</h2>
      <p>This is your tasks page. Task management features will be added in later parts.</p>
    </div>
  );
};

export default TasksPage;
