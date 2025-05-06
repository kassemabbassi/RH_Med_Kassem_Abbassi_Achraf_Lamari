import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';


import "../styles/animation.css";


export default function login() {

    const { login } = useAuth();

    //Loading *********************************** 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [])

    ///********** ***********************************





    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");


    const [ReqBody, SetReqBoduy] = useState(
        {
            "email": "",
            "password": ""
        }
    );



    const LoginReq = async () => {
        try {
          await login(ReqBody);
        } catch (error) {
            //notify(error.response.data);
            console.log(error)
        }
    };

    useEffect(() => {
        SetReqBoduy(() => ({
            email: Email,
            password: Password
        }));
    }, [Email, Password]);

    let compteur = 1;

    const notify = (message) => {
        toast.error("(" + compteur + ") " + message, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        compteur += 1;
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div>
            {loading ? (
                <div className="loader">
                    <div className="letter">ISIMM</div>
                </div>
            ) : (
                <div className="h-screen relative bg-cover  bg-center flex-col flex   justify-center items-center" style={{ backgroundImage: "url('image3.jpg')" }}>
                    <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
                    <div className=" grid justify-center items-center  w-screen ">
                        <div className="lg:p-10 lg:w-80 lg:h-96 md:p-10 md:w-80 md:h-96 p-3 grid grid-cols-1 bg-transparent backdrop-blur-md justify-center items-center rounded-xl z-20 shadow-[0px_0px_100px_30px_gray]  border-2 border-white">
                            <div className="flex flex-col justify-center items-center gap-2 ">
                                <div className="grid   gap-3 w-full h-full ">
                                    <h2 className="text-white text-center font-bold text-3xl">Connexion</h2>
                                    <div className="relative">
                                        <input type="text" value={Email} onChange={handleEmailChange} className="block rounded-lg px-2.5 pb-1 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700  border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                        <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3.5 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
                                    </div>
                                    <div className="relative">
                                        <input type="Password" value={Password} onChange={handlePasswordChange} className="block rounded-lg px-2.5 pb-1 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700  border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                        <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3.5 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Mot De Passe</label>
                                    </div>

                                    <p className="text-gray-500 dark:text-gray-400">
                                        <a href="/Reinitialiser" className="inline-flex items-center font-normal text-sm text-white  hover:underline">
                                            Mot de passe oublié
                                            <svg className="w-3 h-3 ms-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </a>
                                    </p>


                                    <button onClick={LoginReq} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2 ">Connecter</button>
                                </div>
                            </div>
                        </div>
                        <ToastContainer limit={2} />
                    </div>
                </div>
            )}
        </div>
    )
}
