import { ObjectId } from "mongodb";

export interface Note {
    _id?: ObjectId;
    name: string;
    date: string;
    notes: string[];
    orderNo: string;
    cargoFirm: string;
    isDone: boolean;
}
