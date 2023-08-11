import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'

export default function Profile() {
    const auth = getAuth()
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const { name, email } = formData;
    // 28-privateRoute
    return (
        <>
            <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
                <h1 className='text-3xl text-center mt-5 font-bold '>My Profile</h1>
                <div className='w-full md:w-[50%] mt-6 px-3 '>
                    <form >
                        <input type="text"
                            value={name} id="name"
                            disabled
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6'
                        />
                        <input type="email"
                            value={email} id="email"
                            disabled
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 '
                        />
                        <div className='flex justify-between whitespace-nowrap  sm:text-lg mb-6'>
                            <p className='flex items-center'>Do you want to change your name?
                                <span className='text-red-600 hover:text-red-700 cursor-pointer transition ease-in-out duration-200 ml-1 font-semibold'> Edit</span>
                            </p>
                            <p className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer font-semibold'>Sign out</p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}
