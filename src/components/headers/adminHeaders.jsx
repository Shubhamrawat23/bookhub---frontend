import React, { useState } from "react";
import { useStore } from "../../store/store";
import { NavLink } from "react-router-dom";

export default function AdminPortalHeader() {
    const { adminLoginData } = useStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return "A";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        localStorage.clear('loginData');
        window.location.reload();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-100 shadow-sm px-4 md:px-6 py-3">
            {/* Main Header Container */}
            <div className="flex items-center justify-between">

                {/* LEFT - Logo Area */}
                <div className="flex items-center gap-2 min-w-0">
                    <i className="fa-solid fa-book-open fa-lg flex-shrink-0" style={{ color: "#166bba" }}></i>
                    <span className="text-slate-800 font-bold text-base md:text-lg tracking-tight truncate">Book Hub</span>
                    <span className="text-[10px] md:text-xs font-medium text-white bg-[#166bba] px-2 py-0.5 rounded-full">Admin</span>
                </div>

                {/* CENTER - Desktop Navigation Links (Hidden on Mobile) */}
                <nav className="hidden md:flex items-center justify-center gap-6">
                    <NavItem to="/admin/query-tickets" icon="fa-solid fa-ticket" label="Query Tickets" />
                </nav>

                {/* RIGHT - Profile Area & Mobile Trigger */}
                <div className="flex items-center gap-2 md:gap-3">
                    
                    {/* User Profile Info (Meta elements hidden on mobile) */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#166bba] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm">
                            {getInitials(adminLoginData?.name)}
                        </div>
                        <div className="hidden sm:flex flex-col max-w-[120px] md:max-w-[180px]">
                            <span className="text-sm font-medium text-slate-700 truncate leading-tight">
                                {adminLoginData?.name ?? "Admin"}
                            </span>
                            <span className="text-xs text-slate-400 truncate leading-tight">
                                {adminLoginData?.email ?? ""}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1"></div>

                    {/* Logout Action CTA */}
                    <button 
                        onClick={handleLogout}
                        title="Logout"
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>

                    {/* Mobile Menu Action Toggle Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                        <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} fa-lg`}></i>
                    </button>
                </div>
            </div>

            {/* MOBILE DROPDOWN DRAWER PANEL (Only shows on mobile screens when toggled) */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 mt-3 pt-3 pb-2 flex flex-col gap-2 animate-fadeIn">
                    {/* Compact User Detail Info inside Mobile Menu Drawer */}
                    <div className="sm:hidden px-2 pb-2 mb-2 border-b border-slate-50 flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">{adminLoginData?.name ?? "Admin"}</span>
                        <span className="text-xs text-slate-400">{adminLoginData?.email ?? ""}</span>
                    </div>
                    <nav className="flex flex-col gap-1" onClick={() => setIsMenuOpen(false)}>
                        <NavItem to="/admin/query-tickets" icon="fa-solid fa-ticket" label="Query Tickets" isMobile />
                    </nav>
                </div>
            )}
        </header>
    );
}

// Fixed Nav Item helper (Removed hardcoded string paths)
function NavItem({ to, icon, label, isMobile }) {
    return (
        <NavLink
            to={to} // Dynamic prop assignment
            className={({ isActive }) =>
                `flex items-center gap-3 text-sm font-medium transition px-3
                ${isMobile 
                    ? `py-2.5 rounded-lg ${isActive ? "bg-blue-50/70 text-[#166bba]" : "text-slate-600 hover:bg-slate-50"}`
                    : `pb-1.5 border-b-2 ${isActive ? "text-[#166bba] border-[#166bba]" : "text-slate-500 border-transparent hover:text-[#166bba]"}`
                }`
            }
        >
            <i className={`${icon} fa-sm`}></i>
            {label}
        </NavLink>
    );
}