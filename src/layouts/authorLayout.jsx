import React, { useState, useEffect } from "react";
import AuthorPortalHeader from "../components/headers/authorHeaders";
import AuthorPortalSidebar from "../components/sidebars/authorSidebars";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function AuthorLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { authorLoginData } = useStore();
    const navigate = useNavigate()

    useEffect(() => {
        if (authorLoginData?.access_token == null) {
            navigate("/author/login");
        }
    }, [authorLoginData]);

    if (authorLoginData?.access_token == null) return null;

    return (
        <>
            <AuthorPortalHeader />

            <div className="min-h-screen bg-slate-50 flex">

                {/* Sidebar */}
                <div className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300
                    ${sidebarOpen ? "w-56" : "w-14"} 
                    hidden md:block`}
                >
                    <AuthorPortalSidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-10 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile Sidebar */}
                <div className={`fixed top-0 left-0 h-screen z-20 transition-all duration-300
                    ${sidebarOpen ? "w-56" : "w-14"}
                    md:hidden`}
                >
                    <AuthorPortalSidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                </div>

                {/* Content */}
                <main className={`transition-all duration-300 w-full min-h-screen overflow-y-auto ml-14
                    ${sidebarOpen ? "md:ml-56" : "md:ml-14"}`}
                >
                    <Outlet />
                </main>
            </div>
        </>
    );
}