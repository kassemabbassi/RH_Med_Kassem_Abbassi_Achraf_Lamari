import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import "../styles/animation.css";
export default function Reinitialiser() {
    //Loading *********************************** 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [])

    ///********** ***********************************
    return (
        <div>
            {loading ? (
                <div className="loader">
                    <div className="letter">ISIMM</div>
                </div>
            ) : (
                <div className="h-screen relative bg-cover  bg-center justify-center items-center" style={{ backgroundImage: "url('image3.jpg')" }}>
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
            <div className=" grid justify-center items-center h-screen w-screen ">
                <div className="lg:p-10 lg:w-80 lg:h-96 md:p-10 md:w-80 md:h-96 p-3 grid grid-cols-1 bg-transparent backdrop-blur-md justify-center items-center rounded-xl z-20 shadow-[0px_0px_100px_30px_gray]  border-2 border-white">


                    <div className="flex flex-col justify-center items-center gap-2 ">


                        <div className="grid grid-rows-2  gap-3 w-full h-full ">
                            <h2 className="text-white text-center font-bold text-3xl">Reinitialiser Mot De Passe</h2>
                            <div className="relative">
                                <input type="text" id="floating_filled" className="block rounded-lg px-2.5 pb-1 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700  border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" />
                                <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3.5 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
                            </div>

                            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2 ">Reinitialiser</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
            )}
        </div>
    )
}
