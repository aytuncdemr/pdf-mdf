"use client";

import { RaportElement } from "@/interfaces/RaportElement";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function AllImageUploader({
    setRaportElements,
}: {
    setRaportElements: React.Dispatch<
        React.SetStateAction<RaportElement[] | null>
    >;
}) {
    const [files, setFiles] = useState<File[] | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

    useEffect(() => {
        if (files) {
            setRaportElements((prevRaportElements: RaportElement[] | null) => {
                if (!prevRaportElements) {
                    return null;
                }

                const newRaportElements = _.cloneDeep(prevRaportElements);

                for (const raportElement of newRaportElements) {
                    raportElement.photos = undefined;

                    for (const file of files) {
                        const fileName = (
                            file.name.normalize("NFC")[0] +
                            file.name.normalize("NFC")[1]
                        ).toLocaleLowerCase("tr");
                        const fileNo =
                            file.name.normalize("NFC")[2] +
                            file.name.normalize("NFC")[3];

                        const raportName = (
                            raportElement.name
                                .normalize("NFC")
                                .split(" ")[0][0] +
                            raportElement.name.normalize("NFC").split(" ")[1][0]
                        ).toLocaleLowerCase("tr");

                        const raportNo = raportElement.orderNo.slice(-2);

                        if (fileName === raportName && fileNo === raportNo) {
                            if (!raportElement.photos) {
                                raportElement.photos = [file];
                            } else {
                                raportElement.photos.push(file);
                            }
                        }
                    }
                }

                return newRaportElements;
            });
        }
    }, [files]);

    return (
        <div className="image-uploader flex items-center gap-4">
            <div {...getRootProps()} className="flex items-center ">
                <input {...getInputProps()} />
                <button className="text-xl underline cursor-pointer text-amber-500 hover:text-gray-200 underline-offset-4  duration-150">
                    Fotoğrafları Toplu yükle
                </button>
            </div>
        </div>
    );
}
