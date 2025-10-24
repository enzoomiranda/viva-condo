"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useCallback } from "react";
import { FaUsers, FaBuilding } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { BiLogOut } from "react-icons/bi";


const MENU_ITEMS = [
    { href: "/condominios", label: "Condomínios", icon: FaBuilding },
    { href: "/usuarios", label: "Usuarios", icon: FaUsers },
];

export default function Menu() {
    const pathname = usePathname();

    function isActive(href: string) {
        return pathname === href || pathname.startsWith(`${href}/`); //pathname.startsWith garante  exemplos usuarios/123
    }

    const logout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (!error) window.location.href = "/";
    };

    return (
        <aside
            className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-white p-4 shadow-md"
            aria-label="Menu principal"
        >
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2 px-4">
                Viva Condo
            </div>

            {/* Menu Items */}
            <nav className="flex-1">
                <ul className="space-y-2">
                    {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <li key={href}>
                                <Link href={href}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${active
                                            ? "bg-[#E6EEFE] font-medium text-[#FF00FF]"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${active ? "text-[#FF00FF]" : "text-gray-400"}`} />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <hr className="my-4 border-gray-300" />

                <div className="mt-auto">
                    <ul className="space-y-2">
                        <li>
                            <button type="button" onClick={logout} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-left text-red-400 transition-all hover:bg-gray-100">
                                <BiLogOut className="h-4 w-4 text-red-400" />
                                Sair
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
}