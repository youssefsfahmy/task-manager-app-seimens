/* eslint-disable @typescript-eslint/no-explicit-any */
import TaskModal from "@/components/home/task-modal";
import { DragDropContext } from "react-beautiful-dnd";
import TaskColumn from "@/components/home/task-column";
import Filter from "@/components/home/filter";
import { useTasks } from "@/lib/context/task-context";
import { TaskType } from "@/utils/types";
import Plus from "@/components/common/icons/plus";
import DeleteModal from "@/components/home/delete-modal";
import { NewStatus } from "@/components/home/new-status";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lodashClonedeep = require("lodash.clonedeep");

export default function Home() {
  const { allTasksFilteredAndSorted, setOpenedTask, updateTask, statuses } =
    useTasks();

  const onDragEnd = (result: { source: any; destination: any }) => {
    const { source, destination } = result;
    if (!destination) return;

    const allTasksCopy: TaskType[] = lodashClonedeep(allTasksFilteredAndSorted);

    const sourceTasks = allTasksCopy.filter(
      (task) => task.state === source.droppableId
    );
    const destinationTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : allTasksCopy.filter((task) => task.state === destination.droppableId);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);
    // If moving to a different column, update the task's state
    if (source.droppableId !== destination.droppableId) {
      movedTask.state = destination.droppableId;
    }

    // Create a new array for the updated tasks, reflecting any state change
    const updatedTasks = allTasksCopy.map((task) => {
      if (task.id === movedTask.id) {
        return { ...movedTask, order: destination.index }; // Update moved task
      } else if (
        task.state === source.droppableId ||
        (source.droppableId !== destination.droppableId &&
          task.state === destination.droppableId)
      ) {
        // Adjust order for tasks that were shifted as a result of the move
        const currentIndex = destinationTasks.findIndex(
          ({ id }) => id === task.id
        );
        return { ...task, order: currentIndex };
      }
      return task;
    });

    updatedTasks.forEach((task) => {
      updateTask(task.id!, { ...task, order: task.order, state: task.state });
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 flex-col pb-28">
      <div className="text-xl text-white py-5">Task Manager </div>
      <Filter />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full grid grid-rows-3 px-4 gap-2 md:grid-cols-3 md:grid-rows-1 md:gap-16 md:px-16">
          {statuses.map((status) => (
            <TaskColumn
              key={status.id}
              title={status.name}
              tasks={allTasksFilteredAndSorted.filter(
                (task) => task.state === status.name
              )}
              state={status.name}
            />
          ))}
          <NewStatus />
        </div>

        <TaskModal />
        <DeleteModal />
        <div
          onClick={() => setOpenedTask({ title: "", order: -1 } as TaskType)}
          className={`flex fixed text-sm right-6 bottom-6 mx-auto w-fit px-3 py-3 rounded-[100%] text-center text-white transform  transition-all duration-700 z-[10] bg-primary items-center cursor-pointer`}
        >
          <Plus />
        </div>
      </DragDropContext>
    </div>
  );
}
