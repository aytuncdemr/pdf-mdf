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

    isTrendyol: boolean;
    photos?: string[];
    size: number;
}
