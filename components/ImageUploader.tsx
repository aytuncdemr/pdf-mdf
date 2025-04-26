"use client";

import { RaportElement } from "@/interfaces/RaportElement";
import base64Files from "@/utils/base64Files";
import { compressImage } from "@/utils/compressImage";
import _ from "lodash";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({
    setRaportElements,
    orderNo,
}: {
    setRaportElements: React.Dispatch<
        React.SetStateAction<RaportElement[] | null>
    >;
    orderNo: string;
}) {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const acceptedPhotos = await base64Files(acceptedFiles);
        
        setRaportElements((prevState) => {
            const newState = _.cloneDeep(prevState);

            if (!newState) {
                return null;
            }

            const raport = newState.find((elem) => elem.orderNo === orderNo);

            if (raport) {
                raport.photos = raport.photos
                    ? [...raport.photos, ...acceptedPhotos]
                    : [...acceptedPhotos];
            }

            return newState;
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
    });

    return (
        <div className="image-uploader">
            <div
                {...getRootProps()}
                className={`dropzone cursor-pointer ${
                    isDragActive && "bg-gray-900 border-gray-900"
                } border-2 border-gray-500 rounded-lg flex justify-center group hover:border-gray-600 duration-150 items-center mb-4`}
            >
                <input {...getInputProps()} />
                <div className="flex items-center py-2 rounded-lg group-hover:text-gray-500 duration-150">
                    {isDragActive && <p>Ekle...</p>}
                    {!isDragActive && (
                        <p className="text-xl">Fotoğraf Ekle +</p>
                    )}
                </div>
            </div>
        </div>
    );
}
