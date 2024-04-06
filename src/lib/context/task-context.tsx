/* eslint-disable @typescript-eslint/no-explicit-any */
// /contexts/TasksContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { StatusType, TaskType } from "@/utils/types";
import { SORT_CRITERIA } from "@/utils/enums";
import { useSnackbar } from "./snack-bar-context";
import { filterTasksBySearch } from "@/utils/help";
import moment from "moment";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodashClonedeep = require("lodash.clonedeep");

interface TaskContextType {
  allTasksFilteredAndSorted: TaskType[];
  openedTask: null | TaskType;
  setOpenedTask: React.Dispatch<React.SetStateAction<null | TaskType>>;
  addNewTask: (task: TaskType) => Promise<any>;
  updateTask: (taskId: string, updatedTaskData: TaskType) => Promise<any>;
  setSearchFiler: React.Dispatch<React.SetStateAction<string | null>>;
  searchFilter: string | null;
  setSortCriteria: React.Dispatch<React.SetStateAction<SORT_CRITERIA>>;
  sortCriteria: SORT_CRITERIA;
  taskToDelete: null | TaskType;
  setTaskToDelete: React.Dispatch<React.SetStateAction<null | TaskType>>;
  deleteTask: (taskId: string) => Promise<void>;
  statuses: StatusType[];
  addNewSatus: (status: string) => Promise<void>;
  clearTaskContext: () => void;
}

const TasksContext = createContext<TaskContextType | null>(null);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const { openSnackbar } = useSnackbar();
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [allTasksFilteredAndSorted, setAllTasksFilteredAndSorted] = useState<
    TaskType[]
  >([]);
  const [openedTask, setOpenedTask] = useState<TaskType | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);
  const [searchFilter, setSearchFiler] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<SORT_CRITERIA>(
    SORT_CRITERIA.NO_SORT
  );

  useEffect(() => {
    if (!auth.currentUser) {
      clearTaskContext();
      console.log("No authenticated user available.");
      return;
    }
    const userId = auth.currentUser.uid;
    const q = query(collection(db, "tasks"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks: TaskType[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() } as TaskType);
      });
      setAllTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      clearTaskContext();
      console.log("No authenticated user available.");
      return;
    }
    const userId = auth.currentUser.uid;
    // Query for user-specific statuses
    const userSpecificQuery = query(
      collection(db, "status"),
      where("userId", "==", userId)
    );
    // Query for default statuses
    const defaultStatusQuery = query(
      collection(db, "status"),
      where("userId", "==", null)
    );

    const unsubscribeUserSpecific = onSnapshot(
      userSpecificQuery,
      (snapshot) => {
        const userSpecificStatuses: StatusType[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as StatusType)
        );
        setStatuses((prevStatuses) => {
          const defaultStatuses = prevStatuses.filter(
            (status) => status.userId === null
          );
          return [...defaultStatuses, ...userSpecificStatuses];
        });

        console.log("user status", userSpecificStatuses);
      }
    );

    const unsubscribeDefaultStatus = onSnapshot(
      defaultStatusQuery,
      (snapshot) => {
        const defaultStatuses = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as StatusType)
        );
        setStatuses((prevStatuses) => {
          const userSpecificStatuses = prevStatuses.filter(
            (status) => status.userId === userId
          );
          return [...userSpecificStatuses, ...defaultStatuses];
        });
      }
    );

    return () => {
      unsubscribeUserSpecific();
      unsubscribeDefaultStatus();
    };
  }, []);

  useEffect(() => {
    const allTasksTemp: TaskType[] = lodashClonedeep(allTasks);

    // Define a helper function for date comparison
    const compareDates = (a: TaskType, b: TaskType, ascending = true) => {
      const dateA = moment(a.due);
      const dateB = moment(b.due);
      if (ascending) {
        return dateA.diff(dateB);
      }
      return dateB.diff(dateA);
    };

    // Sorting function based on the current criterion
    const sortTasks = (tasks: TaskType[], criterion: SORT_CRITERIA) => {
      switch (criterion) {
        case SORT_CRITERIA.NAME_ASC:
          return tasks.sort((a, b) => a.title.localeCompare(b.title));
        case SORT_CRITERIA.NAME_DESC:
          return tasks.sort((a, b) => b.title.localeCompare(a.title));
        case SORT_CRITERIA.DUE_DATE_ASC:
          return tasks.sort((a, b) => compareDates(a, b, true));
        case SORT_CRITERIA.DUE_DATE_DESC:
          return tasks.sort((a, b) => compareDates(a, b, false));
        // Handle additional sorting criteria here
        default:
          // No additional sorting if the criterion is 'no-sort' or not recognized
          return tasks;
      }
    };

    sortTasks(allTasksTemp, sortCriteria);
    filterTasksBySearch(allTasksTemp, searchFilter);
    setAllTasksFilteredAndSorted(allTasksTemp);
  }, [searchFilter, allTasks, sortCriteria]); // Ensure sortCriterion is included in the dependency array

  const addNewTask = async (task: TaskType) => {
    // Ensure the user is logged in
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }

    const taskWithUser = {
      ...task,
      userId: auth.currentUser.uid, // Link task to the user
    };

    try {
      if (task.id) {
        const taskRef = doc(db, "tasks", task.id);
        delete task.id;
        await updateDoc(taskRef, task);
        openSnackbar("Updated Successfully", false);
      } else {
        await addDoc(collection(db, "tasks"), taskWithUser);
        openSnackbar("Created Successfully", false);
      }
    } catch (e) {
      openSnackbar("Something went wrong" + e);
    } finally {
      setOpenedTask(null);
    }
  };

  const updateTask = async (taskId: string, updatedTaskData: TaskType) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, updatedTaskData);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
      openSnackbar("Deleted Successfully", false);
      setTaskToDelete(null);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const addNewSatus = async (status: string) => {
    // Ensure the user is logged in
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }

    const statusWithUser = {
      name: status,
      userId: auth.currentUser.uid, // Link task to the user
    };

    try {
      await addDoc(collection(db, "status"), statusWithUser);
      openSnackbar("Created Successfully", false);
    } catch (e) {
      openSnackbar("Something went wrong" + e);
    }
  };

  const clearTaskContext = () => {
    setAllTasks([]);
    setStatuses([]);
    setSearchFiler(null);
  };

  const value: TaskContextType | null = {
    allTasksFilteredAndSorted,
    openedTask,
    setOpenedTask,
    addNewTask,
    updateTask,
    setSearchFiler,
    searchFilter,
    sortCriteria,
    setSortCriteria,
    taskToDelete,
    setTaskToDelete,
    deleteTask,
    statuses,
    addNewSatus,
    clearTaskContext,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (context === null) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
