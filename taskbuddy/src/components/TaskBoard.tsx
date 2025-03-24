import React from "react";
import { Task } from "../types/Task";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "./TaskBoard.css";

interface TaskBoardProps {
  tasks: Task[];
  selectedTaskIds: string[];
  toggleSelection: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewLog: (taskId: string) => void;
}

const columns = [
  { id: "todo", title: "To Do", status: "TO_DO" },
  { id: "inprogress", title: "In Progress", status: "IN_PROGRESS" },
  { id: "completed", title: "Completed", status: "COMPLETED" },
];

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  selectedTaskIds,
  toggleSelection,
  onEdit,
  onDelete,
  onViewLog,
}) => {

  const tasksByStatus: { [key: string]: Task[] } = {
    TO_DO: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  };
  tasks.forEach((task) => {
    tasksByStatus[task.status].push(task);
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    console.log("Drag ended:", draggableId, destination.droppableId);
  };

  const renderTaskCard = (task: Task, provided: any) => {
    const isSelected = selectedTaskIds.includes(task.id!);
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="board-card"
      >
        <div className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelection(task.id!)}
          />
        </div>
        <div className="card-title">{task.title}</div>
        <div className="card-description">{task.description}</div>
        <div className="card-meta">
          <span className="card-category">{task.category}</span>
          <span className="card-due">{task.dueDate}</span>
        </div>
        <div className="card-actions">
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
  };

  return (
    <div className="taskboard-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((col) => {
          const colTasks = tasksByStatus[col.status] || [];
          return (
            <Droppable droppableId={col.status} key={col.id}>
              {(provided) => (
                <div
                  className="board-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="board-column-title">{col.title}</h3>
                  {colTasks.map((task, index) => (
                    <Draggable draggableId={task.id!} index={index} key={task.id}>
                      {(provided) => renderTaskCard(task, provided)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
