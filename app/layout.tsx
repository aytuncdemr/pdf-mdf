import type { Metadata } from "next";
import "./globals.css";
import UserContextProvider from "@/contexts/UserContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "pdf-mdf",
    description: "pdf-mdf",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr-TR">
            <body className="bg-gray-800 text-white">
                <UserContextProvider>
                    <Header></Header>
                    <main className="min-h-screen py-6 px-8 lg:px-16">{children}</main>
                </UserContextProvider>
            </body>
        </html>
    );
}
