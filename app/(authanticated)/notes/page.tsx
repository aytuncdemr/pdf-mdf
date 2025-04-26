"use client";
import NoteCard from "@/components/Note";
import SearchQuery from "@/components/SearchQuery";
import { Note } from "@/interfaces/Note";
import { generateNoteQueryName } from "@/utils/generateQueryName";
import { getTodayDate } from "@/utils/getTodayDate";
import { removeTurkishChars } from "@/utils/removeTurkishCharacters";
import axios, { isAxiosError } from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";

export default function NotesPage() {
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[] | null>([]);
    const [query, setQuery] = useState<string | null>(null);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState<Note>({
        name: "",
        orderNo: "",
        date: getTodayDate(),
        isDone: false,
        cargoFirm: "Trendyol",
        notes: [],
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        try {
            setNotes(null);

            const { data } = await axios.get("/api/mongodb/notes");
            setNotes(data);
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                console.log(error);
            }
        }
    }

    async function addNote() {
        setIsAddingNote(false);
        setNewNote({
            name: "",
            orderNo: "",
            date: getTodayDate(),
            isDone: false,
            cargoFirm: "Trendyol",
            notes: [],
        });

        try {
            await axios.post("/api/mongodb/notes", newNote);
            await fetchNotes();
        } catch (error) {
            if (isAxiosError(error)) {
                setError(error.response?.data.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                console.log(error);
            }
        }
    }

    return (
        <section className="notes-section">
            {error && <p className="text-red-500">{error}</p>}
            {notes && (
                <SearchQuery
                    query={query}
                    setQuery={setQuery}
                    length={notes?.length}
                ></SearchQuery>
            )}

            <div className="notes grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
                <div className="border border-gray-500 min-h-[650px] flex flex-col gap-8 p-6 ">
                    {!isAddingNote && (
                        <div className="h-full flex items-center justify-center">
                            <p
                                onClick={() => setIsAddingNote(true)}
                                className="text-xl lg:text-2xl cursor-pointer text-center   rounded-full py-2 px-4 bg-amber-500 hover:border-transparent hover:bg-amber-600 duration-150"
                            >
                                Yeni Not Ekle
                            </p>
                        </div>
                    )}
                    {isAddingNote && (
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="text-center text-xl xl:text-2xl">
                                {newNote.name
                                    ? newNote.name.toLocaleUpperCase() +
                                      (newNote.orderNo
                                          ? "-" +
                                            newNote.orderNo.toLocaleUpperCase()
                                          : "")
                                    : "Yeni Not"}
                            </p>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg xl:text-xl text-amber-400"
                                    htmlFor="name"
                                >
                                    Tarih
                                </label>
                                <input
                                    type="text"
                                    className="text-lg xl:text-xl  p-2 rounded-lg border border-slate-500 outline-none"
                                    value={newNote.date}
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg xl:text-xl text-amber-400"
                                    htmlFor="name"
                                >
                                    İsim
                                </label>
                                <input
                                    type="text"
                                    className="text-lg xl:text-xl  p-2 rounded-lg border border-slate-500 outline-none"
                                    id="name"
                                    value={newNote.name}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg xl:text-xl text-amber-400"
                                    htmlFor="orderNo"
                                >
                                    Sipariş Numarası
                                </label>
                                <input
                                    type="text"
                                    className="text-lg xl:text-xl  p-2 rounded-lg border border-slate-500 outline-none"
                                    id="orderNo"
                                    value={newNote.orderNo}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            orderNo: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg xl:text-xl text-amber-400"
                                    htmlFor="cargoFirm"
                                >
                                    Kargo Firması
                                </label>
                                <input
                                    type="text"
                                    className="text-lg xl:text-xl  p-2 rounded-lg border border-slate-500 outline-none"
                                    id="cargoFirm"
                                    value={newNote.cargoFirm}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            cargoFirm: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label
                                    className="text-lg xl:text-xl text-amber-400"
                                    htmlFor="not"
                                >
                                    Not
                                </label>
                                <textarea
                                    id="not"
                                    className="outline-none min-h-[250px] border border-slate-500 text-lg xl:text-xl p-2 rounded-lg"
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            notes: [e.target.value],
                                        })
                                    }
                                />
                            </div>
                            <button
                                className="bg-green-500 hover:bg-green-600 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                onClick={addNote}
                            >
                                Tamam
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                onClick={() => {
                                    setNewNote({
                                        name: "",
                                        orderNo: "",
                                        date: getTodayDate(),
                                        isDone: false,
                                        cargoFirm: "Trendyol",
                                        notes: [],
                                    });
                                    setIsAddingNote(false);
                                }}
                            >
                                İptal
                            </button>
                        </div>
                    )}
                </div>
                {notes &&
                    notes
                        .filter((note) =>
                            generateNoteQueryName(note).includes(
                                removeTurkishChars(query || "")
                                    ?.trim()
                                    .toLowerCase()
                            )
                        )
                        .map((noteElem, index) => {
                            return (
                                <NoteCard
                                    fetchNotes={fetchNotes}
                                    key={noteElem?._id?.toString() || index}
                                    note={noteElem}
                                ></NoteCard>
                            );
                        })}
            </div>
        </section>
    );
}
