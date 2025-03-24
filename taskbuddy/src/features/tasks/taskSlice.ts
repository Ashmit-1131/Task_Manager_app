import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../types/Task";
import { getAllTasks, createTask, updateTask, deleteTask } from "./taskService";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};


export const fetchTasks = createAsyncThunk<Task[], string>(
  "tasks/fetchTasks",
  async (uid) => {
    return await getAllTasks(uid);
  }
);


export const addTaskThunk = createAsyncThunk<Task, Omit<Task, "id" | "createdAt">>(
  "tasks/addTask",
  async (newTask) => {
    const id = await createTask(newTask);
    return { ...newTask, id, createdAt: Date.now() } as Task;
  }
);


export const updateTaskThunk = createAsyncThunk<
  { id: string; updates: Partial<Task> },
  { id: string; updates: Partial<Task> }
>("tasks/updateTask", async ({ id, updates }) => {
  await updateTask(id, updates);
  return { id, updates };
});


export const deleteTaskThunk = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id) => {
    await deleteTask(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching tasks";
      })
     
      .addCase(addTaskThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
    
      .addCase(updateTaskThunk.fulfilled, (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...action.payload.updates };
        }
      })
   
      .addCase(deleteTaskThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
