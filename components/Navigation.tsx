"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navigation() {
    const pathName = usePathname();
    const router = useRouter();
    return (
        <nav className=" mb-6">
            <ul className="flex gap-4 text-2xl text-center">
                <li>
                    <Link
                        onClick={() => router.push("/pdfs")}
                        className={`${
                            pathName === "/pdfs" && "text-gray-400"
                        } hover:text-gray-400 duration-150`}
                        href={"/pdfs"}
                    >
                        PDF'leri görüntüle
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => router.push("/add-pdf")}
                        className={`${
                            pathName === "/add-pdf" && "text-gray-400"
                        } hover:text-gray-400 duration-150`}
                        href={"/add-pdf"}
                    >
                        PDF Ekle
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
