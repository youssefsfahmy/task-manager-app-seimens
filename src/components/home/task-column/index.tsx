import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskBox from "../task-box";
import { TaskType } from "@/utils/types";
import { useTasks } from "@/lib/context/task-context";
import Plus from "@/components/common/icons/plus";

export default function TaskColumn(props: {
  title: string;
  tasks: TaskType[];
  state: string;
}) {
  const { tasks, state, title } = props;
  const { setOpenedTask } = useTasks();
  return (
    <div className="relative bg-gray-700 shadow-md rounded  pt-4 pb-2 mb-4 md:h-[60vh] flex flex-col gap-3">
      <button
        onClick={() =>
          setOpenedTask({ title: "", order: -1, state: state } as TaskType)
        }
        className="text-black absolute top-0 right-0 mr-3 mt-3"
      >
        <Plus size={25} color="#BBBBBB" />
      </button>
      <div className=" flex content-center text-xs text-white px-4">
        <div className="bg-gray-500 h-5 min-w-5 text-center rounded-2xl content-center mr-2">
          {tasks.length}
        </div>
        <div className="content-center">{title}</div>
      </div>
      <div className="overflow-scroll px-4 h-full">
        <Droppable droppableId={state}>
          {(provided) => (
            <div
              className="bg-gray-700 pb-2 flex flex-col "
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => {
                return (
                  <Draggable
                    key={String(task.id)}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskBox task={task} />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
