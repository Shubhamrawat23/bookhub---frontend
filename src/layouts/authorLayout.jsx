import { useState, useEffect, useCallback } from "react";
import AuthorPortalHeader from "../components/headers/authorHeaders";
import AuthorPortalSidebar from "../components/sidebars/authorSidebars";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { BASE_URL } from "../config.js";   // adjust the path

export default function AuthorLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { setAuthorLoginData } = useStore();
    const navigate = useNavigate();

    const [status, setStatus] = useState("checking");   // checking | ok | error

    const checkMe = useCallback(() => {
        const controller = new AbortController();
        setStatus("checking");

        fetch(`${BASE_URL}/auth/me`, {
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        })
        .then((res) => res.json())
        .then((result) => {
            // console.log(result);
            if (result?.code == 200) {
                setAuthorLoginData({ ...result.data, author_id: result.data.id });
                setStatus("ok");
            } 
            else{
                alert(result?.message)
                if (result.code == 401 || result?.code == 403) {
                    navigate("/author/login");
                }
            }

        })
        .catch((err) => {
            if (err.name !== "AbortError") setStatus("error");
        });

        return () => controller.abort();
    }, [navigate])

    useEffect(() => {
        checkMe()
    }, []);

    if (status === "checking") {
        return (
            <div className="flex items-center justify-center min-h-screen text-slate-400 text-sm gap-2">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Checking session...
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-sm">
                <p className="text-red-500">Can't reach the server.</p>
            </div>
        );
    }

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