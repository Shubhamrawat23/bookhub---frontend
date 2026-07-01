import { NavLink } from "react-router-dom";

export default function AuthorPortalSidebar({ sidebarOpen, setSidebarOpen }) {

    const navItems = [
        { label: "My Books", icon: "fa-solid fa-book", path: "/author/books" },
        { label: "My Tickets", icon: "fa-solid fa-ticket", path: "/author/tickets" }
    ];

    return (
        <aside className="h-full bg-white border-r border-slate-100 shadow-sm flex flex-col overflow-hidden">

            {/* Logo - acts as toggle */}
            <div
                className="flex items-center gap-2 px-4 py-5 border-b border-slate-100 cursor-pointer"
                onClick={() => setSidebarOpen(v => !v)}
            >
                <i className="fa-solid fa-book-open fa-lg flex-shrink-0" style={{ color: "#166bba" }}></i>
                {sidebarOpen && (
                    <span className="text-slate-800 font-bold text-lg tracking-tight whitespace-nowrap">
                        Book Hub
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 p-2 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                            ${isActive
                                ? "bg-blue-50 text-[#166bba]"
                                : "text-slate-500 hover:bg-slate-50 hover:text-[#166bba]"
                            }`
                        }
                    >
                        <i className={`${item.icon} fa-sm w-4 text-center flex-shrink-0`}></i>
                        {sidebarOpen && (
                            <span className="whitespace-nowrap">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-2 border-t border-slate-100">
                <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition w-full"
                    onClick={() => {localStorage.clear('loginData'); window.location.reload();}}
                >
                    <i className="fa-solid fa-right-from-bracket fa-sm w-4 text-center flex-shrink-0"></i>
                    {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
}