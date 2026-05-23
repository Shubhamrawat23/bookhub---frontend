import React, { useEffect } from "react";
import { useStore } from "../../store/store.jsx";
import { useNavigate } from "react-router-dom";

export default function AuthorPortalHeader() {
    const { authorLoginData } = useStore();
    const navigate = useNavigate()
 
    // Get initials from name
    const getInitials = (name) => {
        if (!name) return "A";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <header className="bg-white border-b border-slate-100 shadow-sm px-6 py-3">
            <div className="grid grid-cols-2 items-center">

                {/* LEFT - Logo */}
                <div className="flex items-center gap-2 invisible">
                    <i className="fa-solid fa-book-open fa-lg" style={{ color: "#166bba" }}></i>
                    <span className="text-slate-800 font-bold text-lg tracking-tight">Book Leaf</span>
                </div>

                {/* RIGHT - Profile */}
                <div className="flex items-center justify-end gap-3">

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-200"></div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-[#166bba] flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(authorLoginData?.name)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-[#166bba] transition leading-tight">
                                {authorLoginData?.name ?? "Author"}
                            </span>
                            <span className="text-xs text-slate-400 leading-tight">
                                {authorLoginData?.email ?? ""}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    )
}