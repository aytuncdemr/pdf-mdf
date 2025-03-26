import { RaportElement } from "@/interfaces/RaportElement";
import { useContext, useState } from "react";
import _ from "lodash";
import ImageUploader from "./ImageUploader";
import Image from "next/image";
import createAndDownloadRaportPDF from "@/utils/createAndDownloadRaportPDF";
import { UserContext } from "@/contexts/UserContext";
import calculateDaysDifference from "@/utils/calculateDaysDiffirence";

export default function Raport({
    raportElement,
    setRaportElements,
}: {
    raportElement: RaportElement;
    setRaportElements: React.Dispatch<
        React.SetStateAction<RaportElement[] | null>
    >;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const userContext = useContext(UserContext);
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof RaportElement
    ) {
        setRaportElements((prevState) => {
            const newState = _.cloneDeep(prevState);

            const raport = newState?.find(
                (elem) => elem.orderNo === raportElement.orderNo
            );

            if (raport && field !== "photos" && field !== "isTrendyol") {
                raport[field] = e.target.value;
            }

            return newState;
        });
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
        createAndDownloadRaportPDF(
            raportElement,
            userContext?.user?.token || ""
        );
        removeRaport();
    }

    function removePhoto(photoData: string) {
        setRaportElements((prevState) => {
            const newState = _.cloneDeep(prevState);

            const raport = newState?.find(
                (elem) => elem.orderNo === raportElement.orderNo
            );

            if (raport) {
                raport.photos = raport.photos?.filter(
                    (photo) => photo !== photoData
                );
            }

            return newState;
        });
    }

    return (
        <div className="raport text-white text-xl rounded-md border border-gray-500 py-8 px-4 flex flex-col gap-4">
            <div className="text-2xl text-center text-amber-500">
                {raportElement.name.split(" ")[0].toUpperCase() +
                    " " +
                    raportElement.name.split(" ")[1].toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <label
                        className="px-1 text-amber-400"
                        htmlFor={raportElement.date + raportElement.orderNo}
                    >
                        Tarih
                    </label>
                    <p>
                        {raportElement.isTrendyol
                            ? "(Trendyol)"
                            : "(Hepsiburada)"}
                    </p>
                </div>
                <input
                    type="text"
                    id={raportElement.date + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.date || ""}
                    onChange={(e) => handleChange(e, "date")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.name + raportElement.orderNo}
                >
                    İsim
                </label>
                <input
                    type="text"
                    id={raportElement.name + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.name || ""}
                    onChange={(e) => handleChange(e, "name")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.brand + raportElement.orderNo}
                >
                    Marka
                </label>
                <input
                    type="text"
                    id={raportElement.brand + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.brand || ""}
                    onChange={(e) => handleChange(e, "brand")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.model + raportElement.orderNo}
                >
                    Model
                </label>
                <input
                    type="text"
                    id={raportElement.model + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.model || ""}
                    onChange={(e) => handleChange(e, "model")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.orderNo}
                >
                    Sipariş Numarası
                </label>
                <input
                    type="text"
                    id={raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.orderNo || ""}
                    onChange={(e) => handleChange(e, "orderNo")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.orderDate + raportElement.orderNo}
                >
                    Sipariş Tarihi
                </label>
                <input
                    type="text"
                    id={raportElement.orderDate + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.orderDate || ""}
                    onChange={(e) => handleChange(e, "orderDate")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.refundDate + raportElement.orderNo}
                >
                    İade Talep Tarihi
                </label>
                <input
                    type="text"
                    id={raportElement.refundDate + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={`${raportElement.refundDate} ${
                        raportElement.isTrendyol
                            ? `(${calculateDaysDifference(
                                  raportElement.orderDate,
                                  raportElement.refundDate,
                                  raportElement.isTrendyol
                              )} gün sonra)`
                            : ""
                    }`}
                    onChange={(e) => handleChange(e, "refundDate")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={raportElement.refundReason + raportElement.orderNo}
                >
                    İade Sebebi
                </label>
                <input
                    type="text"
                    id={raportElement.refundReason + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    }`}
                    value={raportElement.refundReason || ""}
                    onChange={(e) => handleChange(e, "refundReason")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={
                        raportElement.refundExplanation + raportElement.orderNo
                    }
                >
                    İade Açıklaması
                </label>
                <textarea
                    id={raportElement.refundExplanation + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none ${
                        !isEditing && "bg-gray-700"
                    } min-h-[16rem]`}
                    value={raportElement.refundExplanation || ""}
                    onChange={(e) => handleChange(e, "refundExplanation")}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    className="px-1 text-amber-400"
                    htmlFor={
                        raportElement.raportExplanation + raportElement.orderNo
                    }
                >
                    Servis Raporu
                </label>
                <textarea
                    id={raportElement.raportExplanation + raportElement.orderNo}
                    className={`border border-gray-500 px-2 rounded-lg py-2 outline-none min-h-[16rem]`}
                    value={raportElement.raportExplanation || ""}
                    onChange={(e) => handleChange(e, "raportExplanation")}
                />
            </div>

            <div className="flex flex-col">
                <ImageUploader
                    setRaportElements={setRaportElements}
                    orderNo={raportElement.orderNo}
                ></ImageUploader>
                <div className="grid justify-items-center grid-cols-2 lg:grid-cols-4 gap-4">
                    {raportElement.photos &&
                        raportElement.photos.length > 0 && (
                            <>
                                {raportElement.photos.map(
                                    (base64Data, index) => (
                                        <div
                                            key={index}
                                            className="relative hover:scale-105 w-[6rem] max-w-[6rem] h-[6rem] hover:opacity-50 duration-150 hover:cursor-pointer"
                                            onClick={() =>
                                                removePhoto(base64Data)
                                            }
                                        >
                                            <Image
                                                src={base64Data}
                                                alt={`Uploaded image ${
                                                    index + 1
                                                }`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    )
                                )}
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
            <button
                onClick={() => setIsEditing((prevState) => !prevState)}
                className="bg-gray-500 hover:bg-gray-600 duration-150 py-2 rounded-lg cursor-pointer"
            >
                {isEditing ? "Tamam" : "Düzenle"}
            </button>
        </div>
    );
}
