import React from 'react';
import {  Dialog } from "@headlessui/react";
import ModalWrapper from "./ModalWrapper";
import Button from './Button';

const ViewNotification = ({open, setOpen, selected}) => {
  return (
    <>
    <ModalWrapper open={open} setOpen={setOpen}>
        <div className="py-4 w-full flex flex-col gap-4 items-center justify-center">
            <Dialog.Title className="font-semibold text-lg">
                {selected?.task?.title}
            </Dialog.Title>
            <p className="text-sm text-gray-500">{selected?.text}</p>

            <Button type="button" label="Ok" 
            onClick={() => setOpen(false)} 
            className="bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:text-white dark:border-blue-500 dark:hover:bg-blue-700 dark:hover:border-blue-600"/>
        </div>
    </ModalWrapper>
    </>
  )
}

export default ViewNotification;