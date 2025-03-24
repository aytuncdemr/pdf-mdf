"use client";

import { RaportElement } from "@/interfaces/RaportElement";
import _ from "lodash";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({
    setRaport,
}: {
    setRaport: React.Dispatch<React.SetStateAction<RaportElement>>;
}) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setRaport((prevState) => {
            const newState = _.cloneDeep(prevState);

            newState.photos = acceptedFiles;

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
                className={`dropzone ${
                    isDragActive && "bg-gray-400 border-none"
                } border-2 border-gray-500 rounded-lg flex justify-center items-center`}
            >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center max-w-[6rem] w-[6rem] h-[6rem] rounded-lg cursor-pointer">
                {isDragActive && <p>Ekle...</p>}
                {!isDragActive && <p className="text-4xl">+</p>}
                </div>
            </div>
        </div>
    );
}
