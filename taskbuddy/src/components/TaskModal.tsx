


import React from "react";
import TaskForm from "./TaskForm";
import "./TaskModal.css";
import { Task } from "../types/Task";

interface TaskModalProps {
  onClose: () => void;
  onTaskCreated: () => void;
  editingTask?: Task | null; // if present => edit mode
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onTaskCreated, editingTask }) => {
  return (
    <div className="taskmodal-overlay">
      <div className="taskmodal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <TaskForm
          onTaskCreated={onTaskCreated}
          editingTask={editingTask} // pass the task if editing
        />
      </div>
    </div>
  );
};

export default TaskModal;

