import React from 'react'
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';
import { toast } from 'sonner';
import { Dialog } from '@headlessui/react';
import Textbox from './Textbox';
import Loading from './Loader';
import Button from './Button';

export const ChangePassword = ({open, setOpen}) => {
    const {register, handleSubmit, formState: {errors}}= useForm();
    const [changePassword, {isLoading}] = useChangePasswordMutation();

    const handleChangePassword = async (data) => {
       if(data.password !== data.cpass){
        toast.warning("Password and Confirm Password do not match");
        return;
       }
       try {
        const res = await changePassword(data).unwrap();
        toast.success("Password changed successfully");
        setOpen(false);
       } catch (err) {
        console.log(err);
        toast.error(err.data.message || err.error);
       }
    }
    return (
        <ModalWrapper open={open} setOpen={setOpen}>
           <form onSubmit={handleSubmit(handleChangePassword)}>
            <Dialog.Title as='h2' className='text-base font-bold text-gray-900 mb-4'>Change Password</Dialog.Title>

            <div>
                <Textbox
                type="password"
                placeholder="New Password"
                label="New Password"
                name="password"
                className="w-full rounded"
                register={register("password",{
                    required: "Password is required",
                })}
                error={errors.password ? errors.password.message : ""}
                />
                <Textbox
                type="password"
                placeholder="Confirm Password"
                label="Confirm Password"
                name="cpass"
                className="w-full rounded"
                register={register("cpass",{
                    required: "Confirm New Password is required",
                })}
                error={errors.cpass ? errors.cpass.message : ""}

                />
            </div>
            {isLoading ? <Loading/> : (
                 <div className='py-3 mt-4 sm:flex sm:flex-row-reverse sm:gap-3'>
                 <Button label="Change Password" type="submit" 
                className="px-8  bg-blue-500 text-white font-semibold hover:bg-blue-600"/>
                <button type='button' 
                onClick={() => setOpen(false)} 
                className=' bg-white px-4 text-sm font-semibold text-gray-900 sm:w-auto '>Cancel</button>
                </div>
                )
                }

           </form>
        </ModalWrapper>
    )
}
