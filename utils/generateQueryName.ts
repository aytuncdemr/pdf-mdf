import { RaportElement } from "@/interfaces/RaportElement";
import { removeTurkishChars } from "./removeTurkishCharacters";

export default function generateQueryName(raport: RaportElement) {
    let queryName = "";

    if (raport.isTrendyol) {
        queryName += "Trendyol";
    } else {
        queryName += "Hepsiburada";
    }

    queryName += raport.name + raport.orderNo;

    return removeTurkishChars(queryName).trim().toLowerCase();
}
