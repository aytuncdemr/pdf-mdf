import { connectMongoDB } from "@/utils/mongodb";
import { Binary } from "mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const body = await request.json();

    if (!jwt.verify(body.token, process.env.JWT_SECRET as string)) {
        return new Response(
            JSON.stringify({
                message: "Bu api route için yetkiniz bulunmamaktadır.",
            }),
            {
                status: 401,
            }
        );
    }

    if (!body) {
        return new Response(
            JSON.stringify({ message: "PDF dökümanı server'a ulaşamadı." }),
            {
                status: 400,
            }
        );
    }

    try {
        const { pdfs } = await connectMongoDB();

        const pdfBuffer = Buffer.from(body.file.split(",")[1], "base64");

        body.file = new Binary(pdfBuffer);
        pdfs.insertOne(body);

        return new Response(
            JSON.stringify({ message: "PDF başarıyla kaydedildi." }),
            {
                status: 200,
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                {
                    status: 500,
                }
            );
        }
    }
}
