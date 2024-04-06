import React from "react";
import { TaskType } from "@/utils/types";
import DateTime from "@/components/common/icons/date-time";
import moment from "moment";
import Trash from "@/components/common/icons/trash";
import { useTasks } from "@/lib/context/task-context";

const TaskBox = (props: { task: TaskType; key?: number }) => {
  const { task, key } = props;
  const { setOpenedTask, setTaskToDelete } = useTasks();
  return (
    <div
      key={key}
      className="relative bg-gray-400 shadow-md rounded px-5 py-2 mb-4 text-xs text-white border border-gray-500 cursor-pointer flex flex-col gap-1"
    >
      <div
        className="text-gray-white text-sm hover:underline font-semibold"
        onClick={() => setOpenedTask(task)}
      >
        {task.title}
      </div>
      <button
        onClick={() => setTaskToDelete(task)}
        className="text-black absolute top-0 right-0 mt-2 mr-2"
      >
        <Trash color="#8b4343" />
      </button>
      <div className="text-gray-50 flex content-center items-center">
        <DateTime className="text-black" color="#FFFFFF" />{" "}
        {moment(task.due).calendar()}
      </div>
      <ul className="flex flex-wrap items-center gap-1 mt-2">
        {/* {task.tags?.map((descriptionTag, index) => {
          return (
            <li key={index}>
              <div
                className={`text-gray-800 shadow-md rounded-xl px-2 py-0.5 bg-gray-50`}
              >
                {descriptionTag}
              </div>
            </li>
          );
        })} */}
      </ul>
    </div>
  );
};

export default TaskBox;
