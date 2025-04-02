import { RaportElement } from "@/interfaces/RaportElement";
import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import { blobToBase64 } from "./blobToBase64";
import { getTodayDate } from "./getTodayDate";
import { compressImage } from "./compressImage";

export default async function createAndDownloadRaportPDF(
    raport: RaportElement,
    token: string
) {
    const { data: pdfFile } = await axios.get("../form.pdf", {
        responseType: "arraybuffer",
        headers: { "Cache-Control": "no-store" },
    });

    const pdfDoc = await PDFDocument.load(pdfFile);
    pdfDoc.registerFontkit(fontkit as any);

    const fontBytes = await axios.get("../arial.ttf", {
        responseType: "arraybuffer",
    });
    const customFont = await pdfDoc.embedFont(new Uint8Array(fontBytes.data));

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const fontSize = 12;

    const splitTextIntoLines = (
        text: string,
        maxWidth: number,
        fontSize: number
    ): string[] => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const widthOfTestLine = customFont.widthOfTextAtSize(
                testLine,
                fontSize
            );

            if (widthOfTestLine <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    };

    const drawTextWithWrap = (text: string, x: number, y: number) => {
        const lines = splitTextIntoLines(text, width - x - 20, fontSize);
        lines.forEach((line, index) => {
            firstPage.drawText(line, {
                x,
                y: y - fontSize * index,
                size: fontSize,
                color: rgb(0, 0, 0),
                font: customFont,
            });
        });
    };
    drawTextWithWrap(raport.date || "", 491, height - 85);
    drawTextWithWrap(raport.name || "", 152, height - 188);
    drawTextWithWrap(raport.brand || "", 137, height - 324);
    drawTextWithWrap(raport.model || "", 132, height - 346);
    drawTextWithWrap(raport.orderNo || "", 157, height - 369);
    drawTextWithWrap(raport.orderDate || "", 136, height - 392);
    drawTextWithWrap(raport.refundDate || "", 123, height - 414);
    drawTextWithWrap(raport.refundReason || "", 98, height - 479);
    drawTextWithWrap(
        raport.refundExplanation.length > 400
            ? raport.refundExplanation.substring(0, 400) + "...."
            : raport.refundExplanation || "",
        115,
        height - 502
    );
    drawTextWithWrap(raport.raportExplanation || "", 62, height - 584);

    if (raport.photos && raport.photos.length > 0) {
        for (const base64Photo of raport.photos) {
            const { byteArray, type } = await compressImage(base64Photo);
            let photo;

            if (type === "image/png") {
                photo = await pdfDoc.embedPng(byteArray);
            } else if (type === "image/jpeg" || type === "image/webp") {
                photo = await pdfDoc.embedJpg(byteArray);
            } else {
                console.error("Unsupported image format (skipping):", type);
                continue;
            }

            const originalWidth = photo.width;
            const originalHeight = photo.height;
            const scaleFactor = Math.min(
                width / originalWidth,
                height / originalHeight
            );
            const scaledWidth = originalWidth * scaleFactor;
            const scaledHeight = originalHeight * scaleFactor;
            const xPos = (width - scaledWidth) / 2;
            const yPos = (height - scaledHeight) / 2;

            const newPage = pdfDoc.addPage([width, height]);
            newPage.drawImage(photo, {
                x: xPos,
                y: yPos,
                width: scaledWidth,
                height: scaledHeight,
            });
        }
    }

    const pdfBytes = await pdfDoc.save();

    //download pdf
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${raport.name + "-" + raport.orderNo}.pdf`;
    link.click();

    //upload pdf to server
    const base64Pdf = await blobToBase64(blob);

    await axios.post(
        "/api/mongodb/pdfs/add-pdf",
        {
            file: base64Pdf,
            size: blob.size,
            name: `${raport.name}-${raport.orderNo}.pdf`,
            uploadedAt: getTodayDate(),
            isTrendyol: raport.isTrendyol,
            token,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        }
    );
}
