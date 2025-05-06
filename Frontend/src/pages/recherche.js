import { useEffect, useState } from "react"
import CheckBox from "@/components/CheckBox";
import RadioCheck from "@/components/RadioCheck";
import DetailUser from "@/components/DetailUser";
import Menu from "@/components/Menu";
import { useAuth } from "@/context/AuthContext";


export default function recherche() {
    const { api } = useAuth();
    const [SexeCheck, setSexeCheck] = useState(0);
    const [handicapeCheck, setHandicapeCheck] = useState(0);

    const [DetailIndex, setDetailIndex] = useState(null);


    const [anciennetes, setAnciennete] = useState([]);
    const [poste, setPoste] = useState([]);
    const [grade, setGrade] = useState([]);
    const [specialite, setSpecialite] = useState([]);

    const [ReqBody, SetReqBoduy] = useState(
        {
            "motCle": "",
            "grades": [],
            "postes": [],
            "specialites": [],
            "anciennites": [],
            "sexe": "",
            "handicape": "",
            "roles": [],
            "departements": []
        }
    )


    const [res, setResponse] = useState();

    useEffect(() => {
        GetFiltre();
        sendRequest();
    }, []);

    const GetFiltre = async () => {
        try {
            setAnciennete((await api.post("/recherche/anciennite", ReqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })).data);

            setGrade((await api.post("/recherche/grade", ReqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })).data);

            setSpecialite((await api.post("/recherche/specialite", ReqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })).data);

            setPoste((await api.post("/recherche/poste", ReqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })).data);
        } catch (error) {
        }
    };

    const sendRequest = async () => {
        try {

            const response = await api.post("/recherche", ReqBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setResponse(response.data);
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };
    const handleInputChange = (event) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            motCle: event.target.value
        }));
    };


    const handleDepartmentsAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            departements: [...prevState.departements, text]
        }));
    };

    const handleDepartmentsRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            departements: prevState.departements.filter((item) => item !== text)
        }));
    };


    const handleRoleAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            roles: [...prevState.roles, text]
        }));
    };

    const handleRoleRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            roles: prevState.roles.filter((item) => item !== text)
        }));
    };


    const handleSexeAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            sexe: text
        }));
    };

    const handleSexeRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            sexe: ""
        }));
    };

    const handleHandicapeAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            handicape: text
        }));
    };

    const handleHandicapeRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            handicape: ""
        }));
    };


    const handleAncienneteAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            anciennites: [...prevState.anciennites, text]
        }));
    };

    const handleAncienneteRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            anciennites: prevState.anciennites.filter((item) => item !== text)
        }));
    };

    const handlePosteAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            postes: [...prevState.postes, text]
        }));
    };

    const handlePosteRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            postes: prevState.postes.filter((item) => item !== text)
        }));
    };


    const handleGradeAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            grades: [...prevState.grades, text]
        }));
    };

    const handleGradeRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            grades: prevState.grades.filter((item) => item !== text)
        }));
    };

    const handleSpecialiteAdd = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            specialites: [...prevState.specialites, text]
        }));
    };

    const handleSpecialiteRemove = (text) => {
        SetReqBoduy((prevState) => ({
            ...prevState,
            specialites: prevState.specialites.filter((item) => item !== text)
        }));
    };








    useEffect(() => {
        sendRequest();
    }, [ReqBody]);

    useEffect(() => {
        console.log(DetailIndex);
    }, [DetailIndex]);



    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? 'hidden' : 'unset';
    }, [isDrawerOpen]);

    const [close, setClose] = useState(false);

    const downloadPdf = async () => {
        try {
            const response = await api.post("/pdf", res, {
                responseType: 'blob',
                headers: {
                    Accept: "application/pdf",
                }
            });

            const blob = response.data;
            const url = URL.createObjectURL(blob);

            const printWindow = window.open(url);
            if (printWindow) {
                printWindow.print();

            }
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF :", error);
            alert('Impossible de générer le PDF');
        }
    };




    return (
        <div className="w-full  bg-white justify-center items-center">
            <div className='sticky top-0 z-40'>
                <Menu activeTab="recherche" />
            </div>

            <div className="  pt-3 shadow-md sm:rounded-lg">
                <div className="pb-3 sticky top-0 bg-white dark:bg-gray-900">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input onChange={handleInputChange} type="text" id="table-search" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                    </div>
                </div>
                <div className=" relative overflow-x-auto max-h-[400px] sm:rounded-lg ">

                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className=" sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-3 py-3">
                                    Numero De Carte D'identité
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Identifiant (Matricule)
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Nom
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Prenom
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Adresse
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Telephone
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Situation
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Sexe
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Date De Naissance
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Handicape
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-3">

                                </th>
                            </tr>
                        </thead>
                        {res && res.length > 0 && (
                            <tbody>
                                {res.map((item, index) => (

                                    <tr key={index} onClick={() => { if (close == false) { setDetailIndex(index); } }} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-wrap dark:text-white">
                                            {item.cin}
                                        </th>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.identifiant}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.nom}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.prenom}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.adresse}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.telephone}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.situation}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.sexe}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.datenaissance}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.handicape}
                                        </td>
                                        <td className="px-3 py-3 text-wrap">
                                            {item.email}
                                        </td>
                                        <DetailUser setClose={(v) => { setClose(v) }} Id={index} Open={index == DetailIndex} Item={item} onClose={(v) => { setDetailIndex(v); console.log(v); }} />
                                    </tr>
                                ))}

                            </tbody>
                        )}
                    </table>
                </div>

            </div>


            <div>

                {isDrawerOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/20"
                        onClick={toggleDrawer}
                    />
                )}
                <button
                    onClick={toggleDrawer}
                    className={`
                        rounded-sm text-white text-md font-mono text-center
                        fixed top-40 right-0 z-40 h-10 w-32   -rotate-90
                        bg-green-600 dark:bg-gray-800 
                        transition-transform duration-300 ease-in-out
                        ${!isDrawerOpen ? 'translate-x-12' : '-translate-x-52'}
                        `}>FILTRER</button>

                <button onClick={downloadPdf} type="button"
                    className={` 
                        ${!isDrawerOpen ? 'translate-x-0' : '-translate-x-60'}
                        transition-transform z-40 duration-300 ease-in-out bottom-1 right-5 fixed  py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:bg-green-400 disabled:opacity-50 disabled:pointer-events-none dark:text-green-400 dark:hover:bg-green-900 dark:focus:bg-green-900`}>
                    Imprimer
                </button>

                <div
                    className={`
                    fixed top-0 -right-64 z-40 h-screen w-64 p-4 
                    overflow-y-auto bg-white dark:bg-gray-800 
                    transition-transform duration-300 ease-in-out
                    ${!isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
                            Filtre
                        </h5>
                        <button
                            onClick={toggleDrawer}
                            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>

                    <nav className="space-y-2 flex flex-col">
                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between  inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Ancienneté
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                {anciennetes.map((item, index) => (
                                    <div className="p-1 space-y-0.5" >
                                        <CheckBox text={item} key={index} uncheckhandle={handleAncienneteRemove} checkhandle={handleAncienneteAdd} />
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Departement
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                <div className="p-1 space-y-0.5">
                                    <CheckBox text="Informatique" uncheckhandle={handleDepartmentsRemove} checkhandle={handleDepartmentsAdd} />
                                </div>
                                <div className="p-1 space-y-0.5">
                                    <CheckBox text="Electronique" uncheckhandle={handleDepartmentsRemove} checkhandle={handleDepartmentsAdd} />
                                </div>
                                <div className="p-1 space-y-0.5">
                                    <CheckBox text="Mathematique" uncheckhandle={handleDepartmentsRemove} checkhandle={handleDepartmentsAdd} />
                                </div>
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Grade
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                {grade.map((item, index) => (
                                    <div className="p-1 space-y-0.5" >
                                        <CheckBox text={item} key={index} uncheckhandle={handleGradeRemove} checkhandle={handleGradeAdd} />
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Handicapé
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                <div className="p-1 space-y-0.5" >
                                    <RadioCheck id={1} checked={handicapeCheck == 1} setCheck={setHandicapeCheck} text="Oui" uncheckhandle={handleHandicapeRemove} checkhandle={handleHandicapeAdd} />
                                </div>
                                <div className="p-1 space-y-0.5">
                                    <RadioCheck id={2} checked={handicapeCheck == 2} setCheck={setHandicapeCheck} text="Non" uncheckhandle={handleHandicapeRemove} checkhandle={handleHandicapeAdd} />
                                </div>
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Poste
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                {poste.map((item, index) => (
                                    <div className="p-1 space-y-0.5" >
                                        <CheckBox text={item} key={index} uncheckhandle={handlePosteRemove} checkhandle={handlePosteAdd} />
                                    </div>
                                ))}
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Role
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                <div className="p-1 space-y-0.5" >
                                    <CheckBox text="Enseignant" uncheckhandle={handleRoleRemove} checkhandle={handleRoleAdd} />
                                </div>
                                <div className="p-1 space-y-0.5">
                                    <CheckBox text="Employee" uncheckhandle={handleRoleRemove} checkhandle={handleRoleAdd} />
                                </div>
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between   inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Sexe
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                <div className="p-1 space-y-0.5" >
                                    <RadioCheck id={1} checked={SexeCheck == 1} setCheck={setSexeCheck} text="Homme" uncheckhandle={handleSexeRemove} checkhandle={handleSexeAdd} />
                                </div>
                                <div className="p-1 space-y-0.5">
                                    <RadioCheck id={2} checked={SexeCheck == 2} setCheck={setSexeCheck} text="Femme" uncheckhandle={handleSexeRemove} checkhandle={handleSexeAdd} />
                                </div>
                            </div>
                        </details>

                        <details className="relative">
                            <summary
                                className="py-3 px-4 w-full justify-between  inline-flex items-center gap-x-2 text-sm font-medium rounded-lg  border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                                aria-haspopup="menu"
                            >
                                Specialité
                                <svg
                                    className="transition-transform duration-200 ease-in-out transform"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <div
                                className="mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                role="menu"
                                aria-orientation="vertical"
                            >
                                {specialite.map((item, index) => (
                                    <div className="p-1 space-y-0.5" >
                                        <CheckBox text={item} key={index} uncheckhandle={handleSpecialiteRemove} checkhandle={handleSpecialiteAdd} />
                                    </div>
                                ))}
                            </div>
                        </details>
                    </nav>
                </div>
            </div>



        </div>



    )
}
