import { RaportElement } from "@/interfaces/RaportElement";
import { useContext, useState } from "react";
import _ from "lodash";
import ImageUploader from "./ImageUploader";
import Image from "next/image";
import createAndDownloadRaportPDF from "@/utils/createAndDownloadRaportPDF";
import { UserContext } from "@/contexts/UserContext";

export default function Raport({
    raportElement,
    setRaportElements,
}: {
    raportElement: RaportElement;
    setRaportElements: React.Dispatch<
        React.SetStateAction<RaportElement[] | null>
    >;
}) {
    const [raport, setRaport] = useState(raportElement);
    const userContext = useContext(UserContext);
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof RaportElement
    ) {
        setRaport((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    }

    function removeRaport() {
        setRaportElements((prevState) => {
            const newState = _.cloneDeep(prevState);

            const index = newState?.findIndex(
                (elem) => elem.orderNo === raportElement.orderNo
            );
            if (index !== undefined && index !== null) {
                newState?.splice(index, 1);
            }
            return newState;
        });
    }

    function saveRaport() {
        createAndDownloadRaportPDF(raport, userContext?.user?.token || "");
        removeRaport();
    }

    function removePhoto(photoName: string) {
        setRaport((prevState) => {
            const newState = _.cloneDeep(prevState);

            return {
                ...newState,
                photos: newState.photos?.filter(
                    (photo) => photo.name !== photoName
                ),
            };
        });
    }

    return (
        <div className="raport text-white text-xl rounded-md border border-gray-500 py-8 px-4 flex flex-col gap-4">
            <div className="text-2xl text-center text-amber-500">
                {raport.name.split(" ")[0].toUpperCase() +
                    " " +
                    raport.name.split(" ")[1].toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.date + raport.orderNo}
                >
                    Tarih
                </label>
                <input
                    type="text"
                    id={raport.date + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.date || ""}
                    onChange={(e) => handleChange(e, "date")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.name + raport.orderNo}
                >
                    İsim
                </label>
                <input
                    type="text"
                    id={raport.name + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.name || ""}
                    onChange={(e) => handleChange(e, "name")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.brand + raport.orderNo}
                >
                    Marka
                </label>
                <input
                    type="text"
                    id={raport.brand + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.brand || ""}
                    onChange={(e) => handleChange(e, "brand")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.model + raport.orderNo}
                >
                    Model
                </label>
                <input
                    type="text"
                    id={raport.model + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.model || ""}
                    onChange={(e) => handleChange(e, "model")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="px-1 text-amber-400" htmlFor={raport.orderNo}>
                    Sipariş Numarası
                </label>
                <input
                    type="text"
                    id={raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.orderNo || ""}
                    onChange={(e) => handleChange(e, "orderNo")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.orderDate + raport.orderNo}
                >
                    Sipariş Tarihi
                </label>
                <input
                    type="text"
                    id={raport.orderDate + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.orderDate || ""}
                    onChange={(e) => handleChange(e, "orderDate")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.refundDate + raport.orderNo}
                >
                    İade Talep Tarihi
                </label>
                <input
                    type="text"
                    id={raport.refundDate + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.refundDate || ""}
                    onChange={(e) => handleChange(e, "refundDate")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.refundReason + raport.orderNo}
                >
                    İade Sebebi
                </label>
                <input
                    type="text"
                    id={raport.refundReason + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none"
                    value={raport.refundReason || ""}
                    onChange={(e) => handleChange(e, "refundReason")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.refundExplanation + raport.orderNo}
                >
                    İade Açıklaması
                </label>
                <textarea
                    id={raport.refundExplanation + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none min-h-[16rem]"
                    value={raport.refundExplanation || ""}
                    onChange={(e) => handleChange(e, "refundExplanation")}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raport.raportExplanation + raport.orderNo}
                >
                    Servis Raporu
                </label>
                <textarea
                    id={raport.raportExplanation + raport.orderNo}
                    className="border border-gray-500 px-2 rounded-lg py-2 outline-none min-h-[16rem]"
                    value={raport.raportExplanation || ""}
                    onChange={(e) => handleChange(e, "raportExplanation")}
                />
            </div>

            <div className="flex flex-col">
                <p className="px-1 mb-3"> Fotoğraf Ekle</p>
                <div className="grid grid-cols-4 gap-4">
                    <ImageUploader setRaport={setRaport}></ImageUploader>
                    {raport.photos && raport.photos.length > 0 && (
                        <>
                            {raport.photos.map((file, index) => {
                                const fileUrl = URL.createObjectURL(file); // Generate URL for each file
                                return (
                                    <div
                                        key={index}
                                        className="relative w-[6rem] max-w-[6rem] h-[6rem] hover:opacity-50 duration-150 hover:cursor-pointer"
                                        onClick={() => removePhoto(file.name)}
                                    >
                                        <Image
                                            src={fileUrl}
                                            alt={`Uploaded image ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            <div className="buttons flex items-center gap-4 mt-auto">
                <button
                    onClick={() => saveRaport()}
                    className={` flex-1 bg-green-600 hover:bg-green-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg`}
                >
                    İndir
                </button>
                <button
                    onClick={() => removeRaport()}
                    className={` flex-1 bg-red-600 hover:bg-red-700 duration-150 text-white text-lg cursor-pointer py-2 px-6 rounded-lg`}
                >
                    Sil
                </button>
            </div>
        </div>
    );
}
