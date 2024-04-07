/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import RichText from "../rich-text-editpr";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { CustomInput } from "@/components/common/custom-input/custom-input";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Button from "@/components/common/button";
import { useSnackbar } from "@/lib/context/snack-bar-context";
import { TaskType } from "@/utils/types";
import { useTasks } from "@/lib/context/task-context";
import X from "@/components/common/icons/x";
import { CustomDropdown } from "@/components/common/drop-down/custom-dropdown";

const TaskModal = () => {
  const { openedTask, addNewTask, setOpenedTask, statuses } = useTasks();
  const cardRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [taskState, setTaskState] = useState<TaskType | null>(null);
  const onClose = () => {
    setOpenedTask(null);
  };
  useOutsideClick(cardRef, onClose);

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskState((prev) => ({ ...prev, [name]: value } as TaskType));
  };

  const handleCreateTask = async (event: any) => {
    event.preventDefault();

    const newTask: TaskType = {
      ...taskState,
      description: convertToRaw(editorState.getCurrentContent()),
    } as TaskType;

    setIsLoading(true);

    try {
      await addNewTask(newTask);
      openSnackbar("Created Successfully", false);
      onClose();
    } catch (error: any) {
      openSnackbar(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTaskState(openedTask);
    setEditorState(
      openedTask?.description
        ? EditorState.createWithContent(convertFromRaw(openedTask?.description))
        : EditorState.createEmpty()
    );
  }, [openedTask]);

  const stateOptions = statuses.map((status) => {
    return { value: status.name, label: status.name };
  });

  if (!openedTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <form
        className="relative bg-gray-100 p-5 rounded-lg shadow-lg w-[95vw] h-[90vh] flex flex-col gap-8 md:h-[80vh] md:w-[80vw]"
        ref={cardRef}
        onSubmit={handleCreateTask}
      >
        <div className="w-full text-center text-base font-bold">
          {taskState?.title ? taskState?.title : "New Task"}
        </div>
        <button
          onClick={onClose}
          className="text-black absolute top-0 right-0 mt-6 mr-6"
        >
          <X />
        </button>
        <div className="flex flex-col w-full justify-between  gap-4 md:flex-row md:gap-4">
          <div>
            <label
              htmlFor="login__username"
              className="block text-gray-900 text-sm font-bold mb-2"
            >
              Title
            </label>
            <CustomInput
              autoComplete="title"
              id="title"
              type="text"
              name="title"
              placeholder="title"
              required
              value={taskState?.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="login__username"
              className="block text-gray-900 text-sm font-bold mb-2"
            >
              Date
            </label>
            <CustomInput
              autoComplete="due"
              id="due"
              type="datetime-local"
              name="due"
              placeholder="Due Date"
              value={
                taskState?.due
                  ? taskState?.due?.toDateString()
                  : new Date().toDateString()
              }
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="login__username"
              className="block text-gray-900 text-sm font-bold mb-2"
            >
              Status
            </label>
            <CustomDropdown
              placeholder="state"
              defaultValue={taskState?.state}
              options={stateOptions}
              value={taskState?.state}
              required
              onChange={(e) =>
                setTaskState(
                  (prev) => ({ ...prev, state: e.target.value } as TaskType)
                )
              }
            />
          </div>
        </div>

        <RichText
          onEditorStateChange={onEditorStateChange}
          editorState={editorState}
        />
        <div className="w-40 self-center">
          <Button isLoading={isLoading} type="submit">
            {openedTask?.id ? "Edit Task" : "Add new Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
