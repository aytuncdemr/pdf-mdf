import { connectMongoDB } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    
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

    try {
        const { pdfs } = await connectMongoDB();

        if (!_id) {
            const pdfDocuments = await pdfs
                .find(
                    {},
                    {
                        projection: {
                            name: 1,
                            _id: 1,
                            uploadedAt: 1,
                            isTrendyol: 1,
                        },
                    }
                )
                .toArray();

            return new Response(JSON.stringify(pdfDocuments), {
                status: 200,
            });
        }

        const pdfDocument = await pdfs.findOne({
            _id: new ObjectId(_id),
        });

        if (!pdfDocument || !pdfDocument.file) {
            return new Response(JSON.stringify({ message: "PDF Bulunamadı" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(pdfDocument), {
            status: 200,
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Beklenmedik bir hata oluştu" }),
                { status: 500 }
            );
        }
    }
}
