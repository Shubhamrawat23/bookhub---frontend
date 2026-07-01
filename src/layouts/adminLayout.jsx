import React, { useEffect } from "react";
import AdminHeader from "../components/headers/adminHeaders";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function AdminLayout() {
    const navigate = useNavigate()
    const {adminLoginData} = useStore()

    useEffect(() => {
            if (adminLoginData?.access_token == null) {
                navigate("/admin/login");
            }
        }, [adminLoginData]);
    
        if (adminLoginData?.access_token == null) return null;
    return (
        <div className="flex flex-col h-screen">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto bg-slate-50 pt-[57px]">
                <Outlet />
            </main>
        </div>
    );
}