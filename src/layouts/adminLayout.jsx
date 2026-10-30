import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/headers/adminHeaders";
import { useStore } from "../store/store";
import { BASE_URL } from "../config.js";   // adjust the path

export default function AdminLayout() {
    const navigate = useNavigate();
    const { setAdminLoginData } = useStore();

    const [status, setStatus] = useState("checking");   // checking | ok | error

    useEffect(() => {
        const controller = new AbortController();
        setStatus("checking");

        fetch(`${BASE_URL}/auth/me`, {
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        })
        .then((res)=> res.json())
        .then((result)=>{
            if (result?.code == 200) {
                setAdminLoginData({ ...result.data, admin_id: result.data.id });
                setStatus("ok");
            } else{
                alert(result?.message)
                if (result.code == 401 || result?.code == 403) {
                    navigate("/admin/login");
                }
            }
        })
        .catch((err) => {
            if (err.name !== "AbortError") setStatus("error");
        });

        return () => controller.abort();
    }, [navigate]);

    if (status === "checking") {
        return (
            <div className="flex items-center justify-center h-screen text-slate-400 text-sm gap-2">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Checking session...
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3 text-sm">
                <p className="text-red-500">Can't reach the server.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto bg-slate-50 pt-[57px]">
                <Outlet />
            </main>
        </div>
    );
}