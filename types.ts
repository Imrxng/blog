import { ObjectId } from "mongodb";

export interface Blog {
    title: string;
    date: string;
    description: string;
    image?: string;
    category: string[];
    _id?: ObjectId;
}