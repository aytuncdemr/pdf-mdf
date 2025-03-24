import { connectMongoDB } from "@/utils/mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    const body = await request.json();
    
    if (!body.userName || !body.password) {
        return new Response(
            JSON.stringify({ message: "Lütfen bütün boşlukları doldurunuz." }),
            { status: 404 }
        );
    }

    try {
        const { users } = await connectMongoDB();
        const user = await users.findOne({
            userName: body.userName,
            password: body.password,
        });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "Hatalı kullanıcı adı veya şifre" }),
                { status: 404 }
            );
        }

        const token = jwt.sign(
            { _id: user._id, userName: user.userName },
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" }
        );

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({
                    message: "Bir şeyler ters gitti:" + error.message,
                }),
                { status: 500 }
            );
        }
    }
}
