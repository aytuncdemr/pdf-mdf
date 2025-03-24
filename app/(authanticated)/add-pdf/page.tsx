"use client";

import AllImageUploader from "@/components/AllImageUploader";
import Raport from "@/components/Raport";
import { UserContext } from "@/contexts/UserContext";
import { RaportElement } from "@/interfaces/RaportElement";
import axios, { isAxiosError } from "axios";
import { useContext, useState } from "react";

export default function AddPDFPage() {
    const [html, setHTML] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [raportElements, setRaportElements] = useState<
        RaportElement[] | null
    >(null);
    const userContext = useContext(UserContext);

    function generateRaportsHandler() {
        try {
            setError(null);
            setHTML(null);
            setRaportElements(null);
            async function getRaportElements() {
                const { data } = await axios.post(
                    "/api/mongodb/generate-raports",
                    { html, token: userContext?.user?.token }
                );
                setRaportElements(data);
                if (data.length) {
                    setError(null);
                } else {
                    setError("Hata: HTML formatı hatalı veya eksik");
                    setRaportElements(null);
                }
            }
            getRaportElements();
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message);
            }
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <section className="add-pdf-section">
            <div className="add-pdf-container">
                <textarea
                    className="bg-gray-700 p-2 text-lg  outline-none border border-gray-600 w-full min-h-96"
                    onChange={(e) => setHTML(e.target.value)}
                    value={html || ""}
                    placeholder="HTML kodunu giriniz"
                ></textarea>
                {error && <p className="text-red-500 text-lg">{error}</p>}

                <div className="flex items-center gap-4">
                    <button
                        className={`bg-amber-600 hover:bg-amber-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg mt-3 ${
                            (!html) &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                        onClick={() => {
                                generateRaportsHandler();
                            
                        }}
                    >
                        Raporları oluştur
                    </button>
                    <button
                        onClick={() => {
                            setHTML(null);
                            setRaportElements(null);
                            setError(null);
                        }}
                        className={` bg-red-600 hover:bg-red-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg mt-3 ${
                            !html &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                    >
                        Temizle
                    </button>
                </div>
                {raportElements && raportElements.length > 0 && (
                    <div className="flex items-center gap-4 mt-6">
                        <p className="text-green-500 text-xl ">
                            Toplam: ({raportElements.length} rapor)
                        </p>
                        <AllImageUploader
                            setRaportElements={setRaportElements}
                        ></AllImageUploader>
                    </div>
                )}
                <div className="raports grid grid-cols-4 gap-8 mt-4">
                    {raportElements &&
                        raportElements.map((raportElem) => {
                            return (
                                <Raport
                                    key={`${raportElem.orderNo}-${raportElem?.photos?.length}`} // Ensuring re-render when photos change
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
