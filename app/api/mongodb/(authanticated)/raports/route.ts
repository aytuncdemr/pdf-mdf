import { connectMongoDB } from "@/utils/mongodb";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
                JSON.stringify({ message: "Token degerini gonderiniz." }),
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

        const { raports } = await connectMongoDB();

        const raportDocument = await raports.findOne({});

        if (raportDocument?.raports && raportDocument.raports.length > 0) {
            return new Response(JSON.stringify(raportDocument.raports), {
                status: 200,
            });
        } else {
            return new Response(
                JSON.stringify({
                    message: "Serverde canlı rapor bulunmamakta.",
                }),
                { status: 404 }
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                { status: 500 }
            );
        }
    }
}

export async function POST(request: Request) {
    try {
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

        const { raports } = await connectMongoDB();
        raports.deleteMany({});
        if (body.raports) {
            raports.insertOne({ raports: body.raports });
        }
        return new Response(
            JSON.stringify({ message: "Başarıyla raporlar yenilendi." }),
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 404,
            });
        } else {
            return new Response(
                JSON.stringify({ message: "Bir şeyler ters gitti" }),
                { status: 500 }
            );
        }
    }
}
