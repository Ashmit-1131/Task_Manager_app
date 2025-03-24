
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { Task } from '../types/Task';

const TASKS_COLLECTION = 'tasks';


export const getAllTasks = async (uid: string): Promise<Task[]> => {
 
  const q = query(collection(db, TASKS_COLLECTION), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Task[];
};


export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
    ...task,
    createdAt: Date.now(), 
  });
  return docRef.id;
};


export const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, id);
  await updateDoc(docRef, updates);
};


export const deleteTask = async (id: string): Promise<void> => {
  const docRef = doc(db, TASKS_COLLECTION, id);
  await deleteDoc(docRef);
};
