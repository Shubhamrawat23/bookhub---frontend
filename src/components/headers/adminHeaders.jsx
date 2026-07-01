import React from "react";
import { useStore } from "../../store/store";
import { NavLink } from "react-router-dom";

export default function AdminPortalHeader() {
    const { adminLoginData } = useStore();

    const getInitials = (name) => {
        if (!name) return "A";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-100 shadow-sm px-6 py-3">
            <div className="grid grid-cols-3 items-center">

                {/* LEFT - Logo */}
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-book-open fa-lg" style={{ color: "#166bba" }}></i>
                    <span className="text-slate-800 font-bold text-lg tracking-tight">Book Hub</span>
                    <span className="text-xs font-medium text-white bg-[#166bba] px-2 py-0.5 rounded-full ml-1">Admin</span>
                </div>

                {/* CENTER - Nav */}
                <nav className="flex items-center justify-center gap-6">
                    <NavItem to="/admin/query-tickets" icon="fa-solid fa-ticket" label="Query Tickets" />
                </nav>

                {/* RIGHT - Profile */}
                <div className="flex items-center justify-end gap-3">

                    <div className="w-px h-6 bg-slate-200"></div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={()=>{localStorage.clear('loginData'); window.location.reload();}}>
                        <div className="w-8 h-8 rounded-full bg-[#166bba] flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(adminLoginData?.name)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 group-hover:text-[#166bba] transition leading-tight">
                                {adminLoginData?.name ?? "Admin"}
                            </span>
                            <span className="text-xs text-slate-400 leading-tight">
                                {adminLoginData?.email ?? ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

// Nav Item helper
function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to="/admin/query-tickets"
            className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium transition pb-0.5
                ${isActive
                    ? "text-[#166bba] border-b-2 border-[#166bba]"
                    : "text-slate-500 hover:text-[#166bba]"
                }`
            }
        >
            <i className={`${icon} fa-sm`}></i>
            {label}
        </NavLink>
    );
}