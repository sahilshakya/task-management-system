import { useEffect, useMemo, useState } from "react";
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
import { Chart } from "../components/Chart";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};
const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }
  return matrix[b.length][a.length];
};

// Binary search function
const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid].toLowerCase() === target.toLowerCase()) {
      return mid;
    }
    if (arr[mid].toLowerCase() < target.toLowerCase()) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
};



const Tasks = () => {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchAlgorithm, setSearchAlgorithm] = useState("fuzzy");
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
  const [comparisonResults, setComparisonResults] = useState(null);

  const status = params?.status || "";

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  const fuse = useMemo(() => new Fuse(data?.tasks || [], {
    keys: ["title", "stage", "priority"],
    threshold: 0.3,
  }), [data?.tasks]);

  // Prepare sorted arrays for binary search
  const sortedTitles = useMemo(() => data?.tasks ? [...data.tasks].sort((a, b) => a.title.localeCompare(b.title)) : [], [data?.tasks]);
  const sortedStages = useMemo(() => data?.tasks ? [...new Set(data.tasks.map(t => t.stage))].sort() : [], [data?.tasks]);
  const sortedPriorities = useMemo(() => data?.tasks ? [...new Set(data.tasks.map(t => t.priority))].sort() : [], [data?.tasks]);
  
  // UseEffect to apply the selected search algorithm and compare results
  useEffect(() => {
    if (data?.tasks) {
      // let fuzzyResult, levenshteinResult;
      let fuzzyResult, binaryResult;
      

      // Fuzzy search
      fuzzyResult = searchQuery
        ? fuse.search(searchQuery).map(({ item }) => item)
        : data.tasks;

      // Levenshtein distance search
      // levenshteinResult = data.tasks.filter(task => {
      //   const titleDistance = levenshteinDistance(searchQuery.toLowerCase(), task.title.toLowerCase());
      //   const stageDistance = levenshteinDistance(searchQuery.toLowerCase(), task.stage.toLowerCase());
      //   const priorityDistance = levenshteinDistance(searchQuery.toLowerCase(), task.priority.toLowerCase());
      //   return Math.min(titleDistance, stageDistance, priorityDistance) <= 3; // Adjust threshold as needed
      // });

      // Binary search
      if (searchQuery) {
        const titleIndex = binarySearch(sortedTitles.map(t => t.title), searchQuery);
        const stageIndex = binarySearch(sortedStages, searchQuery);
        const priorityIndex = binarySearch(sortedPriorities, searchQuery);

        binaryResult = data.tasks.filter(task => 
          (titleIndex !== -1 && task.title === sortedTitles[titleIndex].title) ||
          (stageIndex !== -1 && task.stage === sortedStages[stageIndex]) ||
          (priorityIndex !== -1 && task.priority === sortedPriorities[priorityIndex])
        );
      } else {
        binaryResult = data.tasks;
      }



      // Set filtered tasks based on selected algorithm
      setFilteredTasks(searchAlgorithm === "fuzzy" ? fuzzyResult : binaryResult);

      // Compare results
      setComparisonResults({
        fuzzyCount: fuzzyResult.length,
        binaryCount: binaryResult.length,
        commonCount: fuzzyResult.filter(task => binaryResult.includes(task)).length
      });
    }
  }, [data, searchQuery, searchAlgorithm, fuse,sortedTitles, sortedStages, sortedPriorities]);

  const chartData = [
    { name: 'Fuzzy Search', results: comparisonResults?.fuzzyCount },
    { name: 'Binary Search', results: comparisonResults?.binaryCount },
  ];

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
      <select
          value={searchAlgorithm}
          onChange={(e) => setSearchAlgorithm(e.target.value)}
          className="p-2 rounded-md bg-white border border-gray-300"
        >
          <option value="fuzzy">Fuzzy Search</option>
          <option value="binary">Binary Search</option>
        </select>
      <div className="flex items-center justify-between mb-4">

       {/* Comparison results */}
       {comparisonResults && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">Search Comparison:</h3>
          <p>Fuzzy Search Results: {comparisonResults.fuzzyCount}</p>
          <p>Binary Search Results: {comparisonResults.binaryCount}</p>
          <p>Common Results: {comparisonResults.commonCount}</p>
        </div>
      )}
      
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
      {comparisonResults && (
      <Chart 
        data={chartData} 
        title="Search Algorithm Comparison"
      />
    )}
    </div>
  );
};

export default Tasks;
