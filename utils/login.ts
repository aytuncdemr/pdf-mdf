import axios from "axios";

export default async function login(userName: string, password: string) {
    const { data } = await axios.post("/api/mongodb/login", {
        userName,
        password,
    });

    return data;
}
