import { connectMongoDB } from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const _id = searchParams.get("id");
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
                JSON.stringify({ message: "Token degerini gonderiniz" }),
                { status: 401 }
            );
        }
        const token = authHeader.split(" ")[1];

        if (!jwt.verify(token, process.env.JWT_SECRET as string)) {
            return new Response(
                JSON.stringify({
                    message: "Bu api route için yetkiniz bulunmamaktadır.",
                }),
                {
                    status: 401,
                }
            );
        }
        const { pdfs } = await connectMongoDB();

        if (_id) pdfs.deleteOne({ _id: new ObjectId(_id) });
        return new Response(
            JSON.stringify({ message: "Başarıyla pdf silindi." }),
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 500,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                { status: 500 }
            );
        }
    }
}
