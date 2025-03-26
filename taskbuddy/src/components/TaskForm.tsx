import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { addTaskThunk, updateTaskThunk } from "../features/tasks/taskSlice";
import { auth } from "../firebase";
import { Task } from "../types/Task";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaskForm.css";

interface TaskFormProps {
  onTaskCreated: () => void;
  editingTask?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, editingTask }) => {
  const dispatch = useAppDispatch();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Work" | "Personal" | "Other">("Work");
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate);
      setTagsInput(editingTask.tags ? editingTask.tags.join(", ") : "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Work");
      setDueDate("");
      setTagsInput("");
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      if (editingTask) {
        await dispatch(
          updateTaskThunk({
            id: editingTask.id!,
            updates: {
              title,
              description,
              category,
              dueDate,
              tags,
            },
          })
        ).unwrap();
        toast.success("Task updated successfully!");
      } else {
        const newTask = {
          uid: user.uid,
          title,
          description,
          category,
          dueDate,
          status: "TO_DO" as const,
          tags,
        };
        await dispatch(addTaskThunk(newTask)).unwrap();
        toast.success("Task created successfully!");
      }
      onTaskCreated();
    } catch (error: any) {
      console.error("Error processing task:", error);
      toast.error(`Error: ${error.message || "An error occurred"}`);
    }
  };

  const isEditMode = !!editingTask;

  return (
    <form className="taskform-container" onSubmit={handleSubmit}>
      <h3 className="taskform-title">
        {isEditMode ? "Edit Task" : "Add Task"}
      </h3>
      <input
        type="text"
        placeholder="Task Title"
        className="taskform-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        className="taskform-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="taskform-select"
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
      >
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        className="taskform-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="taskform-input"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />
      <button type="submit" className="taskform-submit-btn">
        {isEditMode ? "Save Changes" : "Create"}
      </button>
    </form>
  );
};

export default TaskForm;
