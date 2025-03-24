"use client";

import { User } from "@/interfaces/User";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | null>(null);

export default function UserContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if (localToken) {
            setUser({ token: localToken });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
