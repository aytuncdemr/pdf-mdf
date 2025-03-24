"use client";

import Navigation from "@/components/Navigation";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function NavigationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isFirstRender, setIsFirstRender] = useState(true);
    const userContext = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
        } else {
            if (!userContext?.user?.token) {
                router.push("/");
                setIsFirstRender(false);
            }
        }
    }, [userContext?.user]);

    return (
        <>
            <Navigation></Navigation>
            {children}
        </>
    );
}
