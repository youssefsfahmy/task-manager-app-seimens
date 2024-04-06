/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import Button from "@/components/common/button";
import { useTasks } from "@/lib/context/task-context";
import Trash from "@/components/common/icons/trash";

const DeleteModal = () => {
  const { setTaskToDelete, taskToDelete, deleteTask } = useTasks();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteTask(taskToDelete!.id!);
    setIsLoading(false);
  };

  const onClose = () => {
    setTaskToDelete(null);
  };
  useOutsideClick(cardRef, onClose);
  if (!taskToDelete?.id) {
    return <></>;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        className="relative bg-gray-100 p-5 rounded-lg shadow-lg w-[95vw] flex flex-col justify-evenly gap-8  md:w-fit md:h-[25vh]"
        ref={cardRef}
      >
        <Trash className="self-center" size={50} color="#8b4343" />
        <div className="w-full text-center text-base font-bold px-10">
          Are you sure you want to delete &quot;{taskToDelete?.title}&quot;?
        </div>

        <div className="flex w-full self-center gap-5">
          <Button onClick={onClose} type="submit" className="bg-[#8b4343]">
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={handleDelete} type="submit">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
