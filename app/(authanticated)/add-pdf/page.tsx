"use client";

import AllImageUploader from "@/components/AllImageUploader";
import Raport from "@/components/Raport";
import { UserContext } from "@/contexts/UserContext";
import { RaportElement } from "@/interfaces/RaportElement";
import axios, { isAxiosError } from "axios";
import { useContext, useEffect, useState } from "react";

export default function AddPDFPage() {
    const [isGettingRaports,setIsGettingRaports] = useState(false);
    const [isGettingLiveRaports,setIsGettingLiveRaports] = useState(false);

    const [html, setHTML] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [raportElements, setRaportElements] = useState<
        RaportElement[] | null
    >(null);
    const userContext = useContext(UserContext);

    async function generateRaportsHandler() {
        try {
            setError(null);
            setHTML(null);
            setRaportElements(null);
            setIsGettingRaports(true);
            const { data } = await axios.post("/api/mongodb/generate-raports", {
                html,
                token: userContext?.user?.token,
            });

            setRaportElements(data);
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }finally{
            setIsGettingRaports(false);
        }
    }

    async function getLiveRaports() {
        try {
            setError(null);
            setIsGettingLiveRaports(true);
            const { data } = await axios.get("/api/mongodb/raports", {
                headers: {
                    Authorization: `Bearer ${userContext?.user?.token}`,
                    "Content-Type": "application/json",
                },
            });

            setRaportElements(data);
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }finally{
            setIsGettingLiveRaports(false);
        }
    }

    useEffect(() => {
        async function sendRaportsMongoDB() {
            try {
                if (!raportElements) {
                    return;
                }
                await axios.post("/api/mongodb/raports", {
                    raports: raportElements,
                    token: userContext?.user?.token,
                });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    setError(error.message);
                }
            }
        }

        const timeOutID = setTimeout(() => {
            sendRaportsMongoDB();
        }, 1000);

        return () => clearTimeout(timeOutID);
    }, [raportElements]);

    return (
        <section className="add-pdf-section">
            <div className="add-pdf-container">
                <textarea
                    className="bg-gray-700 p-2 text-lg  outline-none  w-full min-h-96"
                    onChange={(e) => setHTML(e.target.value)}
                    value={html || ""}
                    placeholder="HTML kodunu giriniz (<tbody>....</tbody>)"
                ></textarea>

                <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-2 lg:gap-4 mt-3">
                    <button
                        className={`bg-amber-600 hover:bg-amber-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg  ${
                            !html &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                        onClick={generateRaportsHandler}
                    >
                        Raporları oluştur
                    </button>
                    <button
                        onClick={() => setHTML(null)}
                        className={` bg-red-600 hover:bg-red-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg  ${
                            !html &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                    >
                        Temizle
                    </button>
                    <button
                        onClick={getLiveRaports}
                        className={
                            "bg-amber-600 hover:bg-amber-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg "
                        }
                    >
                        Canlı Bağlan
                    </button>
                </div>
                {isGettingRaports && <p className="text-xl mt-2">Raporlar hazırlanıyor...</p>}
                {isGettingLiveRaports && <p className="text-xl mt-2">Raporlar alınıyor...</p>}
                {error && <p className="text-red-500 text-lg">{error}</p>}

                {raportElements && raportElements.length > 0 && (
                    <div className="flex flex-col lg:flex-row items-center gap-4 mt-6">
                        <p className="text-green-500 text-xl ">
                            Toplam: ({raportElements.length} rapor)
                        </p>
                        <AllImageUploader
                            setRaportElements={setRaportElements}
                        ></AllImageUploader>
                        <button
                            onClick={() => setRaportElements(null)}
                            className="text-xl underline cursor-pointer text-red-500 hover:text-red-600 underline-offset-4  duration-150"
                        >
                            Raporları Sil
                        </button>
                    </div>
                )}
                <div className="raports grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
                    {raportElements &&
                        raportElements.map((raportElem) => {
                            return (
                                <Raport
                                    key={raportElem.orderNo}
                                    raportElement={raportElem}
                                    setRaportElements={setRaportElements}
                                ></Raport>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
