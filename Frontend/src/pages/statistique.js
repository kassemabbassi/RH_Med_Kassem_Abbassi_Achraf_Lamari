
import { ToastContainer, toast } from 'react-toastify';

import AddRapport from '@/components/AddRapport';
import Menu from '@/components/Menu';
import AbsenceStat from '@/components/Stat/AbsenceStat';
import CongeStat from '@/components/Stat/CongeStat';
import EmploiStat from '@/components/Stat/EmploiStat';
import TacheStat from '@/components/Stat/TacheStat';
import { Calendar1Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

function getCurrentDate() {
    const current = new Date();
    const j = String(current.getDate()).padStart(2, '0');;
    const m = String(current.getMonth() + 1).padStart(2, '0');;
    const a = current.getFullYear();
    return `${a}-${m}-${j}`;
}

export default function statistique() {

    useEffect(()=>{
        console.log("stat");
    },[]);
    const [date, setDate] = useState(
        {
            "debutDate": "2024-01-01",
            "finDate": getCurrentDate(),
        }
    );

    const [debutDate, setDebutDate] = useState("2024-01-01");
    const [finDate, setFinDate] = useState(getCurrentDate());

    let compteur = 1;
    const notify = (message) => {
        toast.error("(" + compteur + ") " + message, {

            style: { backgroundColor: "#BF1C42", color: "white" },
            position: "bottom-center",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        compteur += 1;
    };

    useEffect(() => {
        if (debutDate < finDate) {
            setDate({
                debutDate: debutDate,
                finDate: finDate
            })
        } else {
            notify("La Periode selectionnée est invalide !")
        }
    }, [debutDate, finDate]);

    const [OpenAdd, setOpenAdd] = useState(false);


    return (
        <div >
            <div className='sticky top-0 z-50'>

                <Menu activeTab="stats" />
            </div>


            <div >
                <div className=" p-4 md:p-5 md:flex-row lg:flex-row flex-col flex justify-end items-center  gap-3 ">


                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <Calendar1Icon />
                        </div>
                        <input
                            type="date"
                            name="start"
                            className="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date start"
                            onChange={(e) => (setDebutDate(e.target.value))}
                        />
                    </div>

                    <span className="px-3 text-gray-500 uppercase">à</span>

                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <Calendar1Icon />
                        </div>
                        <input
                            type="date"
                            name="end"
                            className="bg-gray-50 border   h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Select date end"

                            onChange={(e) => (setFinDate(e.target.value))}
                        />
                    </div>

                    <button type="button" onClick={() => setOpenAdd(true)} className="text-white  bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"> Ajouter Un Rapport</button>



                </div>
                <ToastContainer limit={2} />
                <div>

                    <EmploiStat />
                    <AbsenceStat date={date} />
                    <TacheStat date={date} />
                    <CongeStat date={date} />
                </div>
            </div>
            {OpenAdd &&
                <AddRapport date={date} handleToggle={setOpenAdd} />}

        </div>
    );
}
