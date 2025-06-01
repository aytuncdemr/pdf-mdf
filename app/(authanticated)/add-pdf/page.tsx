"use client";

import AllImageUploader from "@/components/AllImageUploader";
import Raport from "@/components/Raport";
import { UserContext } from "@/contexts/UserContext";
import { RaportElement } from "@/interfaces/RaportElement";
import generateQueryName from "@/utils/generateQueryName";
import { getTodayDate } from "@/utils/getTodayDate";
import { removeTurkishChars } from "@/utils/removeTurkishCharacters";
import axios, { isAxiosError } from "axios";
import _ from "lodash";
import { useContext, useState } from "react";

export default function AddPDFPage() {
    const [query, setQuery] = useState<string | null>(null);
    const [isGettingRaports, setIsGettingRaports] = useState(false);
    const [isGettingLiveRaports, setIsGettingLiveRaports] = useState(false);
    const [isUpdatingLiveRaports, setIsUpdatingLiveRaports] = useState(false);
    const [didGetLiveRaports, setDidGetLiveRaports] = useState(false);
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
            setDidGetLiveRaports(false);
            setIsGettingRaports(true);
            setRaportElements(null);
            const { data } = await axios.post("/api/mongodb/generate-raports", {
                html,
                token: userContext?.user?.token,
            });

            setRaportElements(data);
            sendRaportsMongoDB(data);
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setIsGettingRaports(false);
        }
    }

    async function getLiveRaports() {
        try {
            setError(null);
            setHTML(null);
            setIsGettingLiveRaports(true);
            setRaportElements(null);
            const { data } = await axios.get("/api/mongodb/raports", {
                headers: {
                    Authorization: `Bearer ${userContext?.user?.token}`,
                    "Content-Type": "application/json",
                },
            });

            setRaportElements(data);
            setDidGetLiveRaports(true);
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setIsGettingLiveRaports(false);
        }
    }

    async function sendRaportsMongoDB(data?: unknown) {
        try {
            setError(null);
            setIsUpdatingLiveRaports(true);
            await axios.post("/api/mongodb/raports", {
                raports: data || raportElements,
                token: userContext?.user?.token,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setIsUpdatingLiveRaports(false);
        }
    }

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
                            (!html ||
                                isGettingLiveRaports ||
                                isGettingRaports ||
                                isUpdatingLiveRaports) &&
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
                        className={`bg-amber-600 hover:bg-amber-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg ${
                            (isGettingLiveRaports ||
                                isGettingRaports ||
                                isUpdatingLiveRaports) &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                    >
                        {didGetLiveRaports ? "Yenile" : "Bağlan"}
                    </button>

                    <button
                        onClick={() => sendRaportsMongoDB()}
                        className={`bg-amber-600 hover:bg-amber-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg ${
                            (isGettingLiveRaports ||
                                isGettingRaports ||
                                isUpdatingLiveRaports) &&
                            "!bg-gray-500 !cursor-default !pointer-events-none"
                        }`}
                    >
                        Güncelle
                    </button>
                </div>
                {isGettingRaports && (
                    <p className="text-xl mt-2">Raporlar hazırlanıyor....</p>
                )}
                {isGettingLiveRaports && (
                    <p className="text-xl mt-2">Raporlar alınıyor....</p>
                )}
                {isUpdatingLiveRaports && (
                    <p className="text-xl mt-2">Raporlar Güncelleniyor....</p>
                )}
                {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
                {raportElements && raportElements.length > 0 && (
                    <>
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
                        <input
                            type="text"
                            placeholder="Arama yap..."
                            className="outline-none border border-gray-400 text-lg px-4 py-2 rounded-lg mt-4"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </>
                )}
                <div className="raports grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
                    <div className="border border-gray-500 h-[650px] flex flex-col gap-8 items-center justify-center">
                        <p className="text-2xl lg:text-3xl">Yeni Rapor Ekle</p>
                        <div className="flex flex-col gap-4 mt-4">
                            <p
                                onClick={() => {
                                    setRaportElements((prevState) => {
                                        const newState =
                                            _.cloneDeep(prevState) || [];

                                        newState?.push({
                                            date: getTodayDate(),
                                            name: "",
                                            brand: "",
                                            model: "",
                                            orderNo: "" + newState.length,
                                            orderDate: "",
                                            refundDate: "",
                                            refundReason: "",
                                            refundExplanation: "",
                                            raportExplanation:
                                                "Ürün kullanaciya sorunsuz gönderilmiştir. Ürün test edilmiştir herhangi bir sorun bulunamamıştır. Ürün tekrar 0 olarak satışa uygun değildir.",
                                            isTrendyol: true,
                                            isManual: true,
                                        });

                                        return newState;
                                    });
                                }}
                                className="text-center lg:text-xl border rounded-full py-1 px-8 border-gray-400 hover:border-transparent cursor-pointer duration-150 hover:bg-amber-600"
                            >
                                Trendyol
                            </p>
                            <p
                                onClick={() => {
                                    setRaportElements((prevState) => {
                                        const newState =
                                            _.cloneDeep(prevState) || [];

                                        newState?.push({
                                            date: getTodayDate(),
                                            name: "",
                                            brand: "",
                                            model: "",
                                            orderNo: "" + newState.length,
                                            orderDate: "",
                                            refundDate: "",
                                            refundReason: "",
                                            refundExplanation: "",
                                            raportExplanation:
                                                "Ürün kullanaciya sorunsuz gönderilmiştir. Ürün test edilmiştir herhangi bir sorun bulunamamıştır. Ürün tekrar 0 olarak satışa uygun değildir.",
                                            isTrendyol: false,
                                            isManual: true,
                                        });

                                        return newState;
                                    });
                                }}
                                className="text-center lg:text-xl border rounded-full py-1 px-8 border-gray-400 hover:border-transparent cursor-pointer duration-150 hover:bg-amber-600"
                            >
                                Hepsiburada
                            </p>
                        </div>
                    </div>

                    {raportElements &&
                        raportElements
                            .filter((raportElem) =>
                                generateQueryName(raportElem).includes(
                                    removeTurkishChars(query || "")
                                        ?.trim()
                                        .toLowerCase()
                                )
                            )
                            .map((raportElem) => {
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
