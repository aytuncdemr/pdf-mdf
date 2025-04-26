import { connectMongoDB } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const { notes } = await connectMongoDB();

        const noteDocuments = await notes.find({}).toArray();

        return new Response(JSON.stringify(noteDocuments), { status: 200 });
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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { notes } = await connectMongoDB();

        notes.insertOne(body);

        return new Response(JSON.stringify("Başarıyla not eklendi."), {
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
export async function PUT(request: Request) {
    try {
        const { _id, ...body } = await request.json();

        const { notes } = await connectMongoDB();

        notes.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: body });

        return new Response(JSON.stringify("Başarıyla not güncellendi."), {
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
