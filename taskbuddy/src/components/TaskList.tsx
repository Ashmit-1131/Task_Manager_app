


import React from "react";
import { Task } from "../types/Task";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  selectedTaskIds: string[];
  toggleSelection: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewLog: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: "TO_DO" | "IN_PROGRESS" | "COMPLETED") => void;
  onAddTask: () => void; // so that we can show +Add Task in the "Todo" section
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskIds,
  toggleSelection,
  onEdit,
  onDelete,
  onViewLog,
  onStatusChange,
  onAddTask,
}) => {
  // Group tasks by recognized statuses
  const grouped = {
    TO_DO: [] as Task[],
    IN_PROGRESS: [] as Task[],
    COMPLETED: [] as Task[],
  };

  tasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });

  return (
    <div className="tasklist-wrapper">
      <Section
        title="Todo"
        colorClass="todo-section"
        tasks={grouped.TO_DO}
        selectedTaskIds={selectedTaskIds}
        toggleSelection={toggleSelection}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewLog={onViewLog}
        onStatusChange={onStatusChange}
        showAddButton
        onAddTask={onAddTask}
      />
      <Section
        title="In-Progress"
        colorClass="inprogress-section"
        tasks={grouped.IN_PROGRESS}
        selectedTaskIds={selectedTaskIds}
        toggleSelection={toggleSelection}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewLog={onViewLog}
        onStatusChange={onStatusChange}
      />
      <Section
        title="Completed"
        colorClass="completed-section"
        tasks={grouped.COMPLETED}
        selectedTaskIds={selectedTaskIds}
        toggleSelection={toggleSelection}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewLog={onViewLog}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

interface SectionProps {
  title: string;
  colorClass: string;
  tasks: Task[];
  selectedTaskIds: string[];
  toggleSelection: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewLog: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: "TO_DO" | "IN_PROGRESS" | "COMPLETED") => void;
  showAddButton?: boolean;
  onAddTask?: () => void;
}

const Section: React.FC<SectionProps> = ({
  title,
  colorClass,
  tasks,
  selectedTaskIds,
  toggleSelection,
  onEdit,
  onDelete,
  onViewLog,
  onStatusChange,
  showAddButton = false,
  onAddTask,
}) => {
  return (
    <div className={`list-section ${colorClass}`}>
      <div className="list-section-header">
        <h3>
          {title} <span>({tasks.length})</span>
        </h3>
        {showAddButton && onAddTask && (
          <button className="add-task-inline" onClick={onAddTask}>
            + Add Task
          </button>
        )}
      </div>
      {tasks.length > 0 ? (
        <div className="list-table">
          {tasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id!);
            return (
              <div className="list-row" key={task.id}>
                <div className="list-cell check-cell">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(task.id!)}
                  />
                </div>
                <div className="list-cell title-cell">
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div className="task-subtitle">{task.description}</div>
                  )}
                </div>
                <div className="list-cell due-cell">
                  {task.dueDate || "No Date"}
                </div>
                <div className="list-cell status-cell">
                  <span className={`status-pill ${task.status.toLowerCase()}`}>
                    {task.status === "TO_DO"
                      ? "TO-DO"
                      : task.status === "IN_PROGRESS"
                      ? "IN-PROGRESS"
                      : "COMPLETED"}
                  </span>
                  <select
                    className="status-dropdown"
                    value={task.status}
                    onChange={(e) =>
                      onStatusChange(task.id!, e.target.value as "TO_DO" | "IN_PROGRESS" | "COMPLETED")
                    }
                  >
                    <option value="TO_DO">TO-DO</option>
                    <option value="IN_PROGRESS">IN-PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div className="list-cell category-cell">
                  <span className="category-pill">{task.category}</span>
                </div>
                <div className="list-cell action-cell">
                  <button className="edit-btn" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(task.id!)}>
                    Delete
                  </button>
                  <button className="log-btn" onClick={() => onViewLog(task.id!)}>
                    Log
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-msg">No tasks in {title}.</div>
      )}
    </div>
  );
};

export default TaskList;

