import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView, MdOutlineSearch } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import TaskTitle from "../components/TaskTilte";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import Fuse from "fuse.js";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks

  const status = params?.status || "";

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });
  // UseEffect to apply the fuzzy search whenever the data or search query changes
  useEffect(() => {
    if (data?.tasks) {
      const fuse = new Fuse(data.tasks, {
        keys: ["title", "stage", "priority"], // Keys to search by
        threshold: 0.3, // Sensitivity of the search
      });

      const result = searchQuery
        ? fuse.search(searchQuery).map(({ item }) => item)
        : data.tasks;

      setFilteredTasks(result);
    }
  }, [data, searchQuery]);

  return isLoading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#ffffff] my-4">
        <MdOutlineSearch className="text-gray-500 text-xl" />

        <input
          type="text"
          placeholder="Search...."
          className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className="w-full">
            <Table tasks={filteredTasks} />
          </div>
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
