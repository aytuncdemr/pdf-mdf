import { connectMongoDB } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        const { _id, ...body } = await request.json();

        const { notes } = await connectMongoDB();

        notes.findOneAndDelete({ _id: new ObjectId(_id) });

        return new Response(JSON.stringify("Başarıyla not silindi."), {
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
