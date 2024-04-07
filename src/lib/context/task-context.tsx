/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react-hooks/exhaustive-deps */
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
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { StatusType, TaskType } from "@/utils/types";
import { SORT_CRITERIA } from "@/utils/enums";
import { useSnackbar } from "./snack-bar-context";
import { filterTasksBySearch } from "@/utils/help";
import moment from "moment";
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
  setFilterDue: React.Dispatch<React.SetStateAction<boolean>>;
  filterDue: boolean;
}

const TasksContext = createContext<TaskContextType | null>(null);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const { openSnackbar } = useSnackbar();
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [allTasks, setAllTasks] = useState<TaskType[]>([]);
  const [filterDue, setFilterDue] = useState<boolean>(false);
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
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      clearTaskContext();
      return;
    }
    const userId = auth.currentUser.uid;
    // Query for user-specific statuses
    const userSpecificQuery = query(
      collection(db, "status"),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );
    // Query for default statuses
    const defaultStatusQuery = query(
      collection(db, "status"),
      where("userId", "==", null),
      orderBy("createdAt", "asc")
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
          return [...defaultStatuses, ...userSpecificStatuses];
        });
      }
    );

    return () => {
      unsubscribeUserSpecific();
      unsubscribeDefaultStatus();
    };
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    const allTasksTemp: TaskType[] = lodashClonedeep(allTasks);

    const compareDates = (a: TaskType, b: TaskType, ascending = true) => {
      const dateA = moment(a.due);
      const dateB = moment(b.due);
      if (ascending) {
        return dateA.diff(dateB);
      }
      return dateB.diff(dateA);
    };

    const filterDueDates = (tasks: TaskType[]) => {
      if (filterDue) {
        console.log("here");
        return tasks.filter((task) => {
          return moment(task.due).isBefore(moment());
        });
      }
      return tasks;
    };

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
        default:
          return tasks.sort((a, b) => a.order - b.order);
      }
    };

    sortTasks(allTasksTemp, sortCriteria);
    const filteredTasks = filterTasksBySearch(allTasksTemp, searchFilter);
    const dueTasks = filterDueDates(filteredTasks);
    setAllTasksFilteredAndSorted(dueTasks);
  }, [searchFilter, allTasks, sortCriteria, filterDue]);

  const addNewTask = async (task: TaskType) => {
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }

    const taskWithUser = {
      ...task,
      userId: auth.currentUser.uid,
    };

    try {
      if (task.id) {
        const taskRef = doc(db, "tasks", task.id);
        delete task.id;
        await updateDoc(taskRef, task);
      } else {
        await addDoc(collection(db, "tasks"), { ...taskWithUser });
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
      openSnackbar("Successfully moved task", false);
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
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }

    const statusWithUser = {
      name: status,
      createdAt: new Date(),
      userId: auth.currentUser.uid,
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
    filterDue,
    setFilterDue,
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
