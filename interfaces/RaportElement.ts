import { StaticImageData } from "next/image";

export interface RaportElement {
    date: string;
    name: string;
    brand: string;
    model: string;
    orderNo: string;
    orderDate: string;
    refundDate: string;
    refundReason: string;
    refundExplanation: string;
    raportExplanation: string;

    photos?: File[];
}
