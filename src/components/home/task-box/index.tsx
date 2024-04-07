import React from "react";
import { TaskType } from "@/utils/types";
import DateTime from "@/components/common/icons/date-time";
import moment from "moment";
import Trash from "@/components/common/icons/trash";
import { useTasks } from "@/lib/context/task-context";
import Tick from "@/components/common/icons/tick";
import { useSnackbar } from "@/lib/context/snack-bar-context";

const TaskBox = (props: { task: TaskType; key?: number }) => {
  const { task, key } = props;
  const { setOpenedTask, setTaskToDelete, addNewTask } = useTasks();
  const { openSnackbar } = useSnackbar();

  const completeTask = () => {
    try {
      addNewTask({ ...task, state: "Done", isComplete: true });
    } finally {
      openSnackbar("Way to go, moved task to done! ", false);
    }
  };
  return (
    <div
      key={key}
      className="relative bg-gray-400 shadow-md rounded px-5 py-2 mb-4 text-xs text-white border border-gray-500 cursor-pointer flex flex-col gap-1"
    >
      {!task.isComplete && (
        <button
          onClick={completeTask}
          className="text-black absolute bottom-0 right-0 mb-2 mr-2 flex gap-2 text-white"
        >
          Mark as complete
          <Tick color="#FFFFFF" />
        </button>
      )}
      <button
        onClick={() => setTaskToDelete(task)}
        className="text-black absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
      >
        <Trash color="#8b4343" />
      </button>
      <div
        className="text-gray-white text-sm hover:underline font-semibold flex"
        onClick={() => setOpenedTask(task)}
      >
        {task.title}
        <div
          className={`ml-2 rounded-lg  self-center ${
            !task.isComplete && "bg-melon h-3 w-3"
          }`}
        >
          {task.isComplete && <Tick color="green" size={15} />}
        </div>
      </div>

      <div
        className="text-gray-50 flex content-center items-center"
        onClick={() => setOpenedTask(task)}
      >
        <DateTime className="text-black" color="#FFFFFF" />
        {moment(task.due).calendar()}
      </div>
    </div>
  );
};

export default TaskBox;
