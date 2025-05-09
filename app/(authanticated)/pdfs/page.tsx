"use client";

import SearchQuery from "@/components/SearchQuery";
import { UserContext } from "@/contexts/UserContext";
import { removeTurkishChars } from "@/utils/removeTurkishCharacters";
import axios from "axios";
import _ from "lodash";
import { ObjectId } from "mongodb";
import { useContext, useEffect, useState } from "react";

export default function PDFSPage() {
    const [pdfDocuments, setPDFDocuments] = useState<
        | {
              name: string;
              _id: ObjectId;
              uploadedAt: string;
              isTrendyol: boolean;
              size: number;
          }[]
        | null
    >(null);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState<string | null>(null);
    const userContext = useContext(UserContext);

    useEffect(() => {
        try {
            async function getPDFNames() {
                const { data } = await axios.get("/api/mongodb/pdfs", {
                    headers: {
                        Authorization: `Bearer ${userContext?.user?.token}`,
                        "Content-Type": "application/json",
                    },
                });

                setPDFDocuments(data);
            }

            getPDFNames();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }
    }, [userContext?.user]);

    function downloadPDF(_id: string) {
        try {
            async function downloadPDF() {
                const { data } = await axios.get(
                    `/api/mongodb/pdfs?id=${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${userContext?.user?.token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const fileBuffer = Buffer.from(data.file, "base64");
                const blob = new Blob([fileBuffer], {
                    type: "application/pdf",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = data.name;
                link.click();
                window.URL.revokeObjectURL(url);
            }

            downloadPDF();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    function removePDFHandler(
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        _id: string
    ) {

        e.stopPropagation();

        try {
            async function removePDF() {
                await axios.get(
                    `/api/mongodb/pdfs/remove-pdf?id=${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${userContext?.user?.token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setPDFDocuments((prevState) =>{

                    const newState = _.cloneDeep(prevState);

                    

                    return newState?.filter((pdfDocument) => pdfDocument._id.toString() !== _id) || [];
                });
            }

            removePDF();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            }
        }

    }

    return (
        <section className="pdfs-section">
            {error && <div className="text-2xl text-red-500">{error}</div>}

            {pdfDocuments && (
                <SearchQuery
                    query={query}
                    setQuery={setQuery}
                    length={pdfDocuments.length}
                ></SearchQuery>
            )}
            <div className="pdfs-container ">
                {!pdfDocuments && !error && (
                    <div className="text-2xl">Yükleniyor...</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {pdfDocuments
                        ?.filter((pdf) =>
                            removeTurkishChars(
                                pdf.name +
                                    pdf.uploadedAt +
                                    (pdf.isTrendyol
                                        ? "(Trendyol)"
                                        : "(Hepsiburada)")
                            )
                                .trim()
                                .toLowerCase()

                                .includes(
                                    removeTurkishChars(query || "")
                                        ?.trim()
                                        .toLowerCase()
                                )
                        )
                        .reverse()
                        .map((pdf) => {
                            return (
                                <button
                                    onClick={() =>
                                        downloadPDF(pdf._id.toString())
                                    }
                                    key={pdf._id.toString()}
                                    className="text-lg border relative border-gray-500 rounded-xl py-2 px-4 group hover:bg-gray-900 cursor-pointer duration-150"
                                >
                                    <span>
                                        {pdf.name.replace(/\.pdf$/, "")}
                                    </span>
                                    <br />
                                    {pdf.uploadedAt && (
                                        <span className="text-gray-400 group-hover:text-gray-300 duration-150">
                                            ({pdf.uploadedAt}) -{" "}
                                        </span>
                                    )}
                                    <span className="text-amber-500 group-hover:text-amber-400 duration-150">
                                        {pdf.isTrendyol
                                            ? "(Trendyol)"
                                            : "(Hepsiburada)"}
                                    </span>

                                    {pdf.size && (
                                        <span className="absolute bottom-1 right-2 text-sm">
                                            (
                                            {(
                                                pdf.size / Math.pow(1024, 2)
                                            ).toFixed(2)}
                                            MB)
                                        </span>
                                    )}
                                    <span
                                        onClick={(e) =>
                                            removePDFHandler(
                                                e,
                                                pdf._id.toString()
                                            )
                                        }
                                        className="absolute top-1 right-2 text-md text-red-500"
                                    >
                                        Sil
                                    </span>
                                </button>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
