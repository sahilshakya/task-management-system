import React, { useState } from 'react';
import Textbox from '../components/Textbox';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';
import Button from '../components/Button';

export const Settings = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChangePassword = async (data) => {
        if (data.password !== data.cpass) {
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Change Password</h2>
                    <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-6">
                        <Textbox
                            type="password"
                            placeholder="Enter new password"
                            label="New Password"
                            name="password"
                            className="w-full rounded-md"
                            register={register("password", {
                                required: "Password is required",
                            })}
                            error={errors.password ? errors.password.message : ""}
                        />
                        <Textbox
                            type="password"
                            placeholder="Confirm new password"
                            label="Confirm Password"
                            name="cpass"
                            className="w-full rounded-md"
                            register={register("cpass", {
                                required: "Confirm New Password is required",
                            })}
                            error={errors.cpass ? errors.cpass.message : ""}
                        />
                        <div className="pt-4">
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <Button
                                    label="Change Password"
                                    type="submit"
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
                                />
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};