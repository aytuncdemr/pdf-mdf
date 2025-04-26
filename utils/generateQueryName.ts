import { RaportElement } from "@/interfaces/RaportElement";
import { removeTurkishChars } from "./removeTurkishCharacters";
import { Note } from "@/interfaces/Note";

export default function generateQueryName(raport: RaportElement) {
    let queryName = "";

    if (raport.isTrendyol) {
        queryName += "Trendyol";
    } else {
        queryName += "Hepsiburada";
    }

    queryName += raport.name + raport.orderNo + raport.date;

    return removeTurkishChars(queryName).trim().toLowerCase();
}

export function generateNoteQueryName(note: Note) {
    let queryName = "";

    if (note.cargoFirm === "Trendyol") {
        queryName += "Trendyol";
    } else {
        queryName += "Hepsiburada";
    }

    queryName +=
        note.name + note.orderNo + (note.notes.length > 0)
            ? note.notes.reduce((notePrev, noteCurr) => notePrev + noteCurr,"")
            : note.notes[0] + note.date;

    return removeTurkishChars(queryName).trim().toLowerCase();
}
