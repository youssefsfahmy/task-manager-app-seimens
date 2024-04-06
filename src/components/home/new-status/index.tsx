import Button from "@/components/common/button";
import { CustomInput } from "@/components/common/custom-input/CustomInput";
import Plus from "@/components/common/icons/plus";
import { useSnackbar } from "@/lib/context/snack-bar-context";
import { useTasks } from "@/lib/context/task-context";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import React, { useRef, useState } from "react";

export function NewStatus() {
  const [openForm, setOpenForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { statuses, addNewSatus } = useTasks();

  const [newStatus, setNewStatus] = useState<null | string>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(cardRef, () => {
    setOpenForm(false);
    setNewStatus(null);
  });

  const handleNewStatus = () => {
    if (newStatus === "" || newStatus === null) {
      openSnackbar("Status Name can not be empty");
      return;
    }
    if (statuses.map((status) => status.name).includes(newStatus)) {
      openSnackbar("This Status already exists");
      return;
    }
    try {
      addNewSatus(newStatus);
    } finally {
      setOpenForm(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-gray-500 shadow-md rounded  py-4 pb-6 mb-4 md:h-fit flex flex-col gap-3"
    >
      <div className=" flex content-center text-xs text-white px-4">
        <div className="bg-gray-400 h-5 min-w-5 text-center rounded-2xl content-center mr-2">
          0
        </div>
        <div className="content-center">
          {openForm && newStatus
            ? newStatus
            : "Click Here to create New Status"}
        </div>
      </div>
      {openForm ? (
        <div className="w-1/2 ml-auto mr-auto flex flex-col gap-4">
          <CustomInput
            placeholder="New Status Name"
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <Button onClick={handleNewStatus}>Save</Button>
        </div>
      ) : (
        <button onClick={() => setOpenForm(true)} className="self-center">
          <Plus size={70} color="#BBBBBB" />
        </button>
      )}
    </div>
  );
}
