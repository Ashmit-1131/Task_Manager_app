
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import ActivityLog from "../components/ActivityLog";
import { auth } from "../firebase";
import { Task } from "../types/Task";
import { getAllTasks, deleteTask, updateTask } from "../features/tasks/taskService";
import "./TasksPage.css";

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;


  const [viewMode, setViewMode] = useState<"LIST" | "BOARD">("LIST");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);


  const [logTaskId, setLogTaskId] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);


  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Work" | "Personal" | "Other">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

 
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    data: tasks = [],
    refetch,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks", user?.uid],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      return getAllTasks(user.uid);
    },
    enabled: !!user,
  });

  const filteredTasks: Task[] = tasks
    .filter((task: Task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" ? true : task.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a: Task, b: Task) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const toggleSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleBatchDelete = async () => {
    await Promise.all(selectedTaskIds.map((id) => deleteTask(id)));
    setSelectedTaskIds([]);
    refetch();
  };

  const handleBatchMarkCompleted = async () => {
    await Promise.all(selectedTaskIds.map((id) => updateTask(id, { status: "COMPLETED" })));
    setSelectedTaskIds([]);
    refetch();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (taskId: string) => {
    await deleteTask(taskId);
    refetch();
  };

  const handleViewLog = (taskId: string) => {
    setLogTaskId(taskId);
    setShowLogModal(true);
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: "TO_DO" | "IN_PROGRESS" | "COMPLETED"
  ) => {
    await updateTask(taskId, { status: newStatus });
    refetch();
  };

  const handleTaskModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
    refetch();
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleLogModalClose = () => {
    setShowLogModal(false);
    setLogTaskId(null);
  };

  return (
    <div>
      <Navbar />
      <div className="tasks-page-container">
        <div className="tasks-page-header">
          <h2>TaskBuddy</h2>
          <div className="header-actions">
  
            <button className="add-task-btn" onClick={handleOpenAddModal}>
              ADD TASK
            </button>
            <button
              className="toggle-view-btn"
              onClick={() => setViewMode(viewMode === "LIST" ? "BOARD" : "LIST")}
            >
              Switch to {viewMode === "LIST" ? "Board" : "List"} View
            </button>
          </div>
        </div>

        
        <div className="tasks-filters-row">
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as "All" | "Work" | "Personal" | "Other")
            }
          >
            <option value="All">All Categories</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Due Date Asc</option>
            <option value="desc">Due Date Desc</option>
          </select>
          <input
            type="text"
            placeholder="Search by title..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {selectedTaskIds.length > 0 && (
            <div className="batch-actions">
              <button onClick={handleBatchDelete}>Delete Selected</button>
              <button onClick={handleBatchMarkCompleted}>Mark Selected Complete</button>
            </div>
          )}
        </div>

        {viewMode === "LIST" ? (
          <TaskList
            tasks={filteredTasks}
            selectedTaskIds={selectedTaskIds}
            toggleSelection={toggleSelection}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewLog={handleViewLog}
            onStatusChange={handleStatusChange}
            onAddTask={handleOpenAddModal} 
          />
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            selectedTaskIds={selectedTaskIds}
            toggleSelection={toggleSelection}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewLog={handleViewLog}
          />
        )}

        {filteredTasks.length === 0 && (
          <p className="no-tasks-msg">No tasks found. Add a task above!</p>
        )}
      </div>

      {showModal && (
        <TaskModal
          onClose={handleTaskModalClose}
          onTaskCreated={handleTaskModalClose}
          editingTask={editingTask}
        />
      )}

      {showLogModal && logTaskId && (
        <ActivityLog taskId={logTaskId} onClose={handleLogModalClose} />
      )}
    </div>
  );
};

export default TasksPage;
