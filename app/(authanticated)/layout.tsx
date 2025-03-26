"use client";

import Navigation from "@/components/Navigation";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function NavigationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userContext = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!userContext?.user?.token) {
            router.push("/");
        }
    }, [userContext?.user]);

    return (
        <>
            <Navigation></Navigation>
            {userContext?.user?.token && children}
        </>
    );
}
