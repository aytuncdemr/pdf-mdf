import generateRaportElements from "@/utils/generateRaportElements";
import jwt from "jsonwebtoken";

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
        const raportElements = generateRaportElements(body.html);

        if (!(raportElements.length > 0)) {
            return new Response(
                JSON.stringify({
                    message:
                        "Hata: HTML formatı hatalı veya eksik. <tbody></tbody> elementini kopyalayınız.",
                }),
                { status: 400 }
            );
        }

        return new Response(JSON.stringify(raportElements), {
            status: 200,
        });
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
