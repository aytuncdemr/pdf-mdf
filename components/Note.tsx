import { Note } from "@/interfaces/Note";
import axios from "axios";
import { useState } from "react";

export default function NoteCard({
    note,
    fetchNotes,
}: {
    note: Note;
    fetchNotes: () => void;
}) {
    const [newNote, setNewNote] = useState<string | null>(null);
    const [isAddingNewNote, setISAddingNewNote] = useState(false);
    async function setDone() {
        await axios.put("/api/mongodb/notes", { ...note, isDone: true });
        await fetchNotes();
    }

    async function addNote() {
        await axios.put("/api/mongodb/notes", {
            ...note,
            notes: [...note.notes, newNote],
        });
        await fetchNotes();
    }

    async function deleteNote() {
        await axios.post("/api/mongodb/notes/delete", note);
        await fetchNotes();
    }

    return (
        <div className="note border border-gray-500 p-4 relative">
            <div className="flex flex-col gap-4 mt-4">
                <p className="text-lg xl:text-2xl text-amber-400 text-center">
                    {note.name} ({note.orderNo})
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
                        value={note.date}
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
                        value={note.name}
                        disabled
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
                        value={note.orderNo}
                        disabled
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
                        value={note.cargoFirm}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        className="text-lg xl:text-xl text-amber-400"
                        htmlFor="status"
                    >
                        Durum
                    </label>
                    <input
                        type="text"
                        className="text-lg xl:text-xl  p-2 rounded-lg border border-slate-500 outline-none"
                        id="status"
                        value={note.isDone ? "Tamamlandı" : "Devam Ediyor"}
                        disabled
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        className="text-lg xl:text-xl text-amber-400"
                        htmlFor="not"
                    >
                        Notlar
                    </label>
                    {note.notes.map((note, index) => (
                        <textarea
                            id={note + index}
                            className="outline-none min-h-[250px] mb-4 border border-slate-500 text-lg xl:text-xl p-2 rounded-lg"
                            disabled
                            value={note}
                            key={index}
                        />
                    ))}
                    {!note.isDone && (
                        <>
                            {isAddingNewNote && (
                                <>
                                    <label
                                        className="text-lg xl:text-xl text-amber-400"
                                        htmlFor="newnote"
                                    >
                                        Yeni Not
                                    </label>
                                    <textarea
                                        id="newnote"
                                        className="outline-none min-h-[250px] border border-slate-500 text-lg xl:text-xl p-2 rounded-lg mt-4"
                                        value={newNote || ""}
                                        onChange={(e) =>
                                            setNewNote(e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={() => {
                                            addNote();
                                            setISAddingNewNote(false);
                                        }}
                                        className="border border-gray-50 mt-4 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                    >
                                        Tamam
                                    </button>
                                    <button
                                        onClick={() =>
                                            setISAddingNewNote(false)
                                        }
                                        className="border border-gray-50 my-4 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                    >
                                        İptal
                                    </button>
                                </>
                            )}
                            {!isAddingNewNote && (
                                <button
                                    onClick={() => setISAddingNewNote(true)}
                                    className="border border-gray-50 mb-4 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                >
                                    Başka not ekle +
                                </button>
                            )}

                            <div className="flex flex-col gap-4 mt-auto ">
                                <button
                                    className="bg-green-500 hover:bg-green-600 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                                    onClick={setDone}
                                >
                                    Tamamlandı İşaretle
                                </button>
                            </div>
                        </>
                    )}
                    <button
                        className=" absolute top-2 right-2 text-red-500 duration-150 p-2 text-lg xl:text-xl rounded-lg cursor-pointer"
                        onClick={deleteNote}
                    >
                        Sil
                    </button>
                </div>
            </div>
        </div>
    );
}
