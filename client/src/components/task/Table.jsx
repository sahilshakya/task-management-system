import { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import { useTrashTaskMutation } from "../../redux/slices/api/taskApiSlice";
import AddTask from "./AddTask";
import { useSelector } from "react-redux";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sortOrder, setSortOrder] = useState({ key: "", order: "asc" }); // State for sorting

  const [deleteTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: selected,
        isTrashed: "trash",
      }).unwrap();

      toast.success(res?.message);
      setOpenDialog(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const editTaskHandler = (id) => {
    setSelected(id);
    setOpenEdit(true);
  };

  // Quick Sort Algorithm
  const quickSort = (arr, key, order = "asc") => {
    if (arr.length < 2) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];

    arr.forEach((item) => {
      const comparison =
        typeof item[key] === "string"
          ? item[key].localeCompare(pivot[key]) // Compare strings
          : item[key] - pivot[key]; // Compare numbers

      if (comparison < 0) {
        order === "asc" ? left.push(item) : right.push(item);
      } else if (comparison > 0) {
        order === "asc" ? right.push(item) : left.push(item);
      }
    });

    return [
      ...quickSort(left, key, order),
      pivot,
      ...quickSort(right, key, order),
    ];
  };

  // Apply sorting based on the selected key
  const sortedTasks = sortOrder.key
    ? quickSort([...tasks], sortOrder.key, sortOrder.order)
    : tasks;

  const handleSort = (key) => {
    const order = sortOrder.order === "asc" ? "desc" : "asc"; // Toggle order
    setSortOrder({ key, order });
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black text-left">
        <th className="py-2 cursor-pointer" onClick={() => handleSort("title")}>
          Task Title ⬆️⬇️
        </th>
        <th
          className="py-2 cursor-pointer"
          onClick={() => handleSort("priority")}
        >
          Priority
        </th>
        <th className="py-2 cursor-pointer">Created At</th>
        <th className="py-2">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {task?.title}
          </p>
        </div>
      </td>

      <td className="py-2">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span className="capitalize line-clamp-1">
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-2">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.date))}
        </span>
      </td>

      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 items-center text-sm text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <MdAttachFile />
            <span>{task?.assets?.length}</span>
          </div>
          <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
            <FaList />
            <span>0/{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="py-2">
        <div className="flex">
          {task?.team?.map((m, index) => (
            <div
              key={m._id}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>

      {user?.add && (
        <td className="py-2 flex gap-2 md:gap-4 justify-end">
          <Button
            className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
            label="Edit"
            type="button"
            onClick={() => editTaskHandler(task)}
          />

          <Button
            className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
            label="Delete"
            type="button"
            onClick={() => deleteClicks(task._id)}
          />
        </td>
      )}
    </tr>
  );

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              {sortedTasks?.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

export default Table;
