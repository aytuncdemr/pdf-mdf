"use client";

import { RaportElement } from "@/interfaces/RaportElement";
import { blobToBase64 } from "@/utils/blobToBase64";
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
    const [error, setError] = useState<string | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
    });

    useEffect(() => {
        async function setRaportPhotos() {
            if (!files || !(files.length > 0)) {
                return;
            }

            try {
                const base64Files = await Promise.all(files.map(blobToBase64));

                setRaportElements((prevRaportElements) => {
                    if (!prevRaportElements) return null;
                    const newRaportElements = _.cloneDeep(prevRaportElements);
                    const unmatchedFiles: string[] = [];

                    for (const file of files) {
                        let fileMatched = false;

                        for (const raportElement of newRaportElements) {
                            const base64File = base64Files[files.indexOf(file)];

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
                                raportElement.name
                                    .normalize("NFC")
                                    .split(" ")[1][0]
                            ).toLocaleLowerCase("tr");

                            const raportNo = raportElement.orderNo.slice(-2);

                            if (
                                fileName === raportName &&
                                fileNo === raportNo
                            ) {
                                if (!raportElement.photos) {
                                    raportElement.photos = [base64File];
                                } else {
                                    raportElement.photos.push(base64File);
                                }
                                fileMatched = true;
                                break;
                            }
                        }

                        if (!fileMatched) {
                            unmatchedFiles.push(file.name);
                        }
                    }

                    if (unmatchedFiles.length > 0) {
                        setError(
                            `Bu dosyalar hiçbir raporla eşleşmedi: [${unmatchedFiles.join(
                                ", "
                            )}]`
                        );
                    }

                    return newRaportElements;
                });
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(
                        "Fotoğraflar toplu yüklenirken bir hata meydana geldi."
                    );
                }
            }
        }
        setRaportPhotos();
    }, [files]);

    return (
        <div className="image-uploader flex items-center gap-4">
            <div {...getRootProps()} className="flex items-center ">
                <input {...getInputProps()} />
                <button className="text-xl underline cursor-pointer text-amber-500 hover:text-amber-600 underline-offset-4  duration-150">
                    Fotoğrafları Toplu yükle
                </button>
            </div>
            {error && <p className="text-red-500">({error})</p>}
        </div>
    );
}
