import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./ActivityLog.css";

export interface LogEntry {
  id: string;
  taskId: string;
  activity: string;
  timestamp: number;
}

interface ActivityLogProps {
  taskId: string;
  onClose: () => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ taskId, onClose }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "taskLogs"),
        where("taskId", "==", taskId),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const fetchedLogs: LogEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LogEntry[];
      setLogs(fetchedLogs);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [taskId]);

  return (
    <div className="activity-log-overlay">
      <div className="activity-log-modal">
        <button className="activity-log-close" onClick={onClose}>
          &times;
        </button>
        <h3>Activity Log</h3>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : logs.length > 0 ? (
          <ul className="activity-log-list">
            {logs.map((log) => (
              <li key={log.id}>
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
                : {log.activity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No activity logs found for this task.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
