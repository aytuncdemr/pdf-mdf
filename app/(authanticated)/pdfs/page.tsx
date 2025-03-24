"use client";

import SearchQuery from "@/components/SearchQuery";
import { UserContext } from "@/contexts/UserContext";
import { removeTurkishChars } from "@/utils/removeTurkishCharacters";
import axios from "axios";
import { ObjectId } from "mongodb";
import { useContext, useEffect, useState } from "react";

export default function PDFSPage() {
    const [pdfDocuments, setPDFDocuments] = useState<
        { name: string; _id: ObjectId }[] | null
    >(null);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<string | null>(null);

    const userContext = useContext(UserContext);

    useEffect(() => {
        async function getPDFNames() {
            const { data } = await axios.get("/api/mongodb/pdfs", {
                headers: {
                    Authorization: `Bearer ${userContext?.user?.token}`,
                    "Content-Type": "application/json",
                },
            });

            setPDFDocuments(data);
        }

        if (userContext?.user?.token) {
            try {
                getPDFNames();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message);
                } else if (error instanceof Error) {
                    setError(error.message);
                }
            }
        }
    }, [userContext?.user]);

    function downloadPDF(_id: string) {
        async function downloadPDF() {
            const { data } = await axios.get(`/api/mongodb/pdfs?id=${_id}`, {
                headers: {
                    Authorization: `Bearer ${userContext?.user?.token}`,
                    "Content-Type": "application/json",
                },
            });
            const fileBuffer = Buffer.from(data.file, "base64");
            const blob = new Blob([fileBuffer], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = data.name;
            link.click();
            window.URL.revokeObjectURL(url);
        }

        downloadPDF();
    }
    return (
        <section className="pdfs-section">
            <div className="pdfs-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pdfDocuments && (
                    <SearchQuery
                        query={query}
                        setQuery={setQuery}
                        length={pdfDocuments.length}
                    ></SearchQuery>
                )}
                {pdfDocuments
                    ?.filter((pdf) =>
                        removeTurkishChars(pdf.name)
                            .toLowerCase()
                            .includes(
                                removeTurkishChars(query || "")?.toLowerCase()
                            )
                    )
                    .reverse()
                    .map((pdf) => {
                        return (
                            <button
                                onClick={() => downloadPDF(pdf._id.toString())}
                                key={pdf._id.toString()}
                                className="text-lg border border-gray-500 rounded-lg py-2 px-4 hover:bg-gray-900 cursor-pointer duration-150"
                            >
                                {pdf.name.replace(/\.pdf$/, "")}
                            </button>
                        );
                    })}
                {!pdfDocuments && <div className="text-2xl">Yükleniyor...</div>}
                {error && <div className="text-2xl text-red-500">{error}</div>}
            </div>
        </section>
    );
}
