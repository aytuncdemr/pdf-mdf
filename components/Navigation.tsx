"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathName = usePathname();
    return (
        <nav className=" mb-6">
            <ul className="flex  gap-4 text-xl  lg:text-2xl lg:text-center">
                <li>
                    <Link
                        className={`${
                            pathName === "/pdfs" && "text-gray-400"
                        } hover:text-gray-400 duration-150`}
                        href={"/pdfs"}
                    >
                        PDF&apos;leri görüntüle
                    </Link>
                </li>
                <li>
                    <Link
                        className={`${
                            pathName === "/add-pdf" && "text-gray-400"
                        } hover:text-gray-400 duration-150`}
                        href={"/add-pdf"}
                    >
                        PDF Ekle
                    </Link>
                </li>
                <li>
                    <Link
                        className={`${
                            pathName === "/notes" && "text-gray-400"
                        } hover:text-gray-400 duration-150`}
                        href={"/notes"}
                    >
                        Notlar
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
