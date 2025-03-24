export interface Task {
  id?: string;
  uid: string;                  // User ID who created the task
  title: string;
  description: string;
  category: "Work" | "Personal" | "Other";
  dueDate: string;              // Format: YYYY-MM-DD
  createdAt: number;            // Timestamp in milliseconds
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  attachmentUrl?: string;       // URL for file attachment
  tags?: string[];              // Optional tags for filtering
}
