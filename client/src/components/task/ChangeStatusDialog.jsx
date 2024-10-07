import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useUpdateTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import SelectList from "../SelectList";
import { LISTS } from "./AddTask";

const ChangeStatusDialog = ({ open, setOpen, task }) => {
  const [stage, setStage] = useState(task?.stage || LISTS[0]);

  const [updateTask] = useUpdateTaskMutation();

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      const res = await updateTask({
          id: task._id,
          title:task.title,
        priority: task.priority,
        team: task.team,
        stage,
      }).unwrap();

      toast.success(res?.message || "Status updated successfully");
      setOpen(false);
      
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err.error || "Failed to update status");
    }
  };

  return (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" style={{ minHeight: '250px' }}>
                    <form onSubmit={handleStatusChange}>
                    <div className="mb-4">
                        
                        <SelectList
                        label="Task Stage"
                        lists={LISTS}
                        selected={stage}
                        setSelected={setStage}
                        />
                    </div>
                    <div className="mt-10 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                        Update
                        </button>
                        <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => setOpen(false)}
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ChangeStatusDialog;