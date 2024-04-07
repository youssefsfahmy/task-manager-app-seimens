import { CustomInput } from "@/components/common/custom-input/custom-input";
import ToggleSwitch from "@/components/common/custom-toggle/custom-toggle";
import { CustomDropdown } from "@/components/common/drop-down/custom-dropdown";
import Search from "@/components/common/icons/search";
import Sorting from "@/components/common/icons/sorting";
import { useTasks } from "@/lib/context/task-context";
import { SORT_CRITERIA } from "@/utils/enums";
import React from "react";

function Filter() {
  const {
    setSearchFiler,
    searchFilter,
    sortCriteria,
    setSortCriteria,
    setFilterDue,
    filterDue,
  } = useTasks();

  const sortingOptions = [
    { value: SORT_CRITERIA.NO_SORT, label: "Default Order" },
    { value: SORT_CRITERIA.NAME_ASC, label: "Name (A-Z)" },
    { value: SORT_CRITERIA.NAME_DESC, label: "Name (Z-A)" },
    { value: SORT_CRITERIA.DUE_DATE_ASC, label: "Due Date (earliest first)" },
    { value: SORT_CRITERIA.DUE_DATE_DESC, label: "Due Date (latest first)" },
  ];
  return (
    <div className="mb-6 flex w-full px-4 flex-col justify-between content-between gap-4 md:px-16 md:flex-row ">
      <CustomDropdown
        options={sortingOptions}
        value={sortCriteria}
        onChange={(e) => {
          setSortCriteria(e.target.value as SORT_CRITERIA);
        }}
        icon={<Sorting color="#AAAAAA" />}
      />
      <div className="flex self-center gap-4 text-white">
        Show Due Tasks Only
        <ToggleSwitch isEnabled={filterDue} setIsEnabled={setFilterDue} />
      </div>
      <CustomInput
        onChange={(e) => setSearchFiler(e.target.value)}
        value={searchFilter || ""}
        placeholder="Filter Tasks"
        icon={<Search color="#AAAAAA" />}
      />
    </div>
  );
}

export default Filter;
