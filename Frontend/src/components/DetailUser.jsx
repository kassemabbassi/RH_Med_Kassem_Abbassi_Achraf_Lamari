import React, { useEffect, useState } from "react";

const DetailUser = ({ Id, Open, Item ,onClose ,  setClose}) => {
    const [isOpen, setOpen] = useState(Open);
    useEffect(() => {
        if (Open == true) {
            setOpen(true);
            setClose(true);
        }else{
            setClose(false);
        }
    }, [Open]);
    const Close=()=>{
        setOpen(false);
        onClose(-1);
    }



    return (
        <div>
            {isOpen &&
                <div
                    className="fixed h-screen w-screen inset-0 z-50 bg-black bg-opacity-50 flex  justify-center p-8"
                >
                    <div name="content" style={{
                        margin: "20px",
                    }} className="w-full  max-w-md flex flex-col bg-white rounded-lg gap-5 shadow-lg ">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {Item.nom.toUpperCase()} {Item.prenom.charAt(0).toUpperCase() + Item.prenom.slice(1)}
                            </h3>
                            <button
                                onClick={Close}
                                className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm p-2">
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto" >



                            {Object.entries(Item)
                                .slice(0, 11)
                                .map(([key, value]) => (
                                    <div key={key} className="border-s p-4 border-gray-500 ms-3.5 mb-4">
                                        <h3 className=" ml-5 text-lg font-semibold text-gray-900 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)} </h3>
                                        <p className="text-sm text-gray-500">{value}</p>
                                    </div>
                                ))}
                            {Object.entries(Item.emploi)
                                .slice(1, 8)
                                .map(([key, value]) => (
                                    <div key={key} className="border-s p-4 border-gray-500 ms-3.5 mb-4">
                                        <h3 className=" ml-5 text-lg font-semibold text-gray-900 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)} </h3>
                                        <p className="text-sm text-gray-500">{value}</p>
                                    </div>
                                ))}
                            <div className="border-s p-4 border-gray-500 ms-3.5 mb-4">
                                        <h3 className=" ml-5 text-lg font-semibold text-gray-900 mb-1">Quota </h3>
                                        <p className="text-sm text-gray-500">{Item.emploi.quota.quota}</p>
                                    </div>    
                        </div>

                    </div>
                </div>

            }
        </div>
    );
};

export default DetailUser;