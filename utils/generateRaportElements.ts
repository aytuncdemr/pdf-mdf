import { RaportElement } from "@/interfaces/RaportElement";
import { JSDOM } from "jsdom";
import { getTodayDate } from "./getTodayDate";
import removeExtraSpaces from "./trimWhiteSpaces";

export default function generateRaportElements(html: string) {
    const fragment = JSDOM.fragment(html);

    if (!fragment || !html) {
        return [];
    }

    const tableTrendyolRows = fragment.querySelectorAll(
        ".chakra-table__row.css-xpkcrm"
    );
    const tableHepsiburadaRows = fragment.querySelectorAll(".claim-row");

    const raportElements: RaportElement[] = [];

    tableTrendyolRows.forEach((row) => {
        const raportElement: RaportElement = {
            name:
                removeExtraSpaces(
                    row.querySelectorAll(".css-3e0hee .css-1mx7c9e")[0]
                        ?.textContent
                ) || "*",
            date: getTodayDate(),
            brand: "SoundWave",
            model:
                truncateText(
                    removeExtraSpaces(
                        row.querySelectorAll(".chakra-link.css-oo0rmg")[0]
                            ?.textContent
                    )
                ) + " (1 adet)" || "*",
            orderNo:
                removeExtraSpaces(
                    row.querySelectorAll(".css-12vjdro .css-ei6dok")[0]
                        ?.textContent
                ) || "*",
            refundDate:
                removeExtraSpaces(
                    row.querySelectorAll(".css-1mx7c9e")[1]?.textContent
                ) || "*",
            refundExplanation:
                removeExtraSpaces(
                    row.querySelectorAll(".css-6qub7p .css-1mx7c9e")[0]
                        ?.textContent
                ) || "*",
            raportExplanation:
                "Ürün kullanaciya sorunsuz gönderilmiştir. Ürün test edilmiştir herhangi bir sorun bulunamamıştır. Ürün tekrar 0 olarak satışa uygun değildir.",
            orderDate:
                removeExtraSpaces(
                    row.querySelectorAll(".css-1mx7c9e")[0]?.textContent
                ) || "*",
            refundReason:
                removeExtraSpaces(
                    row.querySelectorAll(".css-l7b5vo .css-giljn2")[0]
                        ?.textContent
                ) || "*",
            isTrendyol: true,
        };
        raportElements.push(raportElement);
    });

    if (raportElements.length > 0) {
        return raportElements;
    }

    tableHepsiburadaRows.forEach((row) => {
        const raportElement: RaportElement = {
            name:
                removeExtraSpaces(
                    row.querySelectorAll(".summary-claim-info__name__text")[0]
                        ?.textContent
                ) || "*",
            date: getTodayDate(),
            brand: "SoundWave",
            model:
                truncateText(
                    removeExtraSpaces(
                        row.querySelectorAll(".product-card__content__name")[0]
                            ?.textContent
                    )
                ) + " (1 adet)" || "*",
            orderNo:
                removeExtraSpaces(
                    row.querySelectorAll(
                        ".solo-list-item.summary-claim-info__order__number__content__text .solo-list-item__value"
                    )[0]?.textContent
                ) || "*",
            refundDate:
                removeExtraSpaces(
                    row.querySelectorAll(
                        ".solo-list-item.summary-claim-info__claim__date__content__text .solo-list-item__content .solo-list-item__value"
                    )[0]?.textContent
                ) || "*",
            refundExplanation:
                removeExtraSpaces(
                    row.querySelectorAll(
                        ".summary-claim-explanation__content__claim-explanation"
                    )[0]?.textContent
                ) || "*",
            raportExplanation:
                "Ürün kullanaciya sorunsuz gönderilmiştir. Ürün test edilmiştir herhangi bir sorun bulunamamıştır. Ürün tekrar 0 olarak satışa uygun değildir.",
            orderDate:
                removeFirstTwoWords(
                    removeExtraSpaces(
                        row.querySelectorAll(
                            ".summary-claim-info__order__date"
                        )[0]?.textContent
                    )
                ) || "*",
            refundReason:
                removeExtraSpaces(
                    row.querySelectorAll(
                        ".summary-claim-explanation__content__claim-reason"
                    )[0]?.textContent
                ) || "*",
            isTrendyol: false,
        };
        raportElements.push(raportElement);
    });

    return raportElements;
}

function truncateText(text: string | undefined, length = 25) {
    if (!text) {
        return;
    }

    text = text.replace(/\n/g, " ");
    return text.length > length ? text.slice(0, length) + "...." : text;
}
function removeFirstTwoWords(str: string | undefined) {
    if (!str) {
        return;
    }

    const words = str.split(" ").slice(2);
    return words.join(" ");
}
