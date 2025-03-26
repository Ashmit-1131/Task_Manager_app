import React, { useState } from "react";
import { Task } from "../types/Task";
import "./TaskBoard.css";

interface TaskBoardProps {
  tasks: Task[];
  selectedTaskIds: string[];
  toggleSelection: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewLog: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: "TO_DO" | "IN_PROGRESS" | "COMPLETED") => void;
  onAddTask: () => void; // For showing "+ Add Task" in the Todo column
}

const TaskBoard: React.FC<TaskBoardProps> = ({
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
    <div className="taskboard-wrapper">
      <BoardColumn
        title="To Do"
        colorClass="todo-header"
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
      <BoardColumn
        title="In-Progress"
        colorClass="inprogress-header"
        tasks={grouped.IN_PROGRESS}
        selectedTaskIds={selectedTaskIds}
        toggleSelection={toggleSelection}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewLog={onViewLog}
        onStatusChange={onStatusChange}
      />
      <BoardColumn
        title="Completed"
        colorClass="completed-header"
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

interface BoardColumnProps {
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

const BoardColumn: React.FC<BoardColumnProps> = ({
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
  // Local state to control collapse/expand
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`board-column ${colorClass}`}>
      <div className="board-column-header">
        <div className="column-title-row">
          <button className="collapse-arrow" onClick={handleToggleCollapse}>
            {collapsed ? "►" : "▼"}
          </button>
          <h3>
            {title} <span>({tasks.length})</span>
          </h3>
        </div>
        {showAddButton && onAddTask && (
          <button className="add-task-inline" onClick={onAddTask}>
            + Add Task
          </button>
        )}
      </div>

      {/* If not collapsed, show tasks vertically */}
      {!collapsed && (
        <>
          {tasks.length > 0 ? (
            <div className="board-tasklist">
              {tasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id!);
                return (
                  <div className="board-taskrow" key={task.id}>
                    {/* Checkbox */}
                    <div className="board-cell check-cell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(task.id!)}
                      />
                    </div>
                    {/* Title & Description */}
                    <div className="board-cell title-cell">
                      <div className="task-title">{task.title}</div>
                      {task.description && (
                        <div className="task-subtitle">{task.description}</div>
                      )}
                    </div>
                    {/* Due Date */}
                    <div className="board-cell due-cell">
                      {task.dueDate || "No Date"}
                    </div>
                    {/* Status (pill + dropdown) */}
                    <div className="board-cell status-cell">
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
                          onStatusChange(
                            task.id!,
                            e.target.value as "TO_DO" | "IN_PROGRESS" | "COMPLETED"
                          )
                        }
                      >
                        <option value="TO_DO">TO-DO</option>
                        <option value="IN_PROGRESS">IN-PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </div>
                    {/* Category */}
                    <div className="board-cell category-cell">
                      <span className="category-pill">{task.category}</span>
                    </div>
                    {/* Actions (3-dot menu) */}
                    <div className="board-cell action-cell">
                      <BoardMoreButton
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id!)}
                        onLog={() => onViewLog(task.id!)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-msg">No tasks in {title}.</div>
          )}
        </>
      )}
    </div>
  );
};

interface BoardMoreButtonProps {
  onEdit: () => void;
  onDelete: () => void;
  onLog: () => void;
}

const BoardMoreButton: React.FC<BoardMoreButtonProps> = ({
  onEdit,
  onDelete,
  onLog,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="board-more-btn-container">
      <button className="dots-button" onClick={handleToggleMenu}>
        •••
      </button>
      {menuOpen && (
        <div className="dots-menu">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
          <button onClick={onLog}>Log</button>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
