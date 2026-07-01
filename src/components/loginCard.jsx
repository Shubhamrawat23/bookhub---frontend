import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

export default function LoginCard({ role }) {
    const loginFetchAPI = null;
    const [errorMsg, setErrorMsg] = useState(null)
    const [showPass, setShowPass] = useState(false)
    const { setAuthorLoginData, setAdminLoginData, adminLoginData, authorLoginData } = useStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (role === "Author" && authorLoginData?.access_token) {
            navigate("/author/books");
        }

        if (role === "Admin" && adminLoginData?.access_token) {
            navigate("/admin/query-tickets");
        }
    }, [authorLoginData, adminLoginData, role]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const email = data.get("email")
        const password = data.get("password")

        // According to the role call Author API for login
        if (role == "Author") {
            fetch(`${BASE_URL}/auth/author/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
                .then((resp) => resp.json())
                .then((result) => {
                    setErrorMsg(null)
                    if (result.code == 404) {
                        setErrorMsg(result.message);
                    }
                    if (result.code == 422) {
                        setErrorMsg(result.message);
                    }

                    if (result.code == 200) {
                        setAuthorLoginData(result.data)
                        alert(result.message)
                        navigate("/author/books")
                    }
                })
                .catch((err) => console.error(err))
        }

        if (role == "Admin") {
            fetch(`${BASE_URL}/auth/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
                .then((resp) => resp.json())
                .then((result) => {
                    setErrorMsg(null)
                    if (result.code == 404) {
                        setErrorMsg(result.message);
                    }
                    if (result.code == 422) {
                        setErrorMsg(result.message);
                    }

                    if (result.code == 200) {
                        setAdminLoginData(result.data)
                        alert(result.message)
                        navigate("/admin/query-tickets")
                    }
                })
                .catch((err) => console.error(err))
        }

    }

    return (
        <div className="flex flex-col justify-center items-center m-auto h-screen bg-slate-50">
            {/* ICON */}
            <div className="flex items-center gap-2 text-2xl font-bold py-3 mb-2">
                <i className="fa-solid fa-book-open fa-xl" style={{ color: "#166bba" }}></i>
                <span className="text-slate-800 tracking-tight">Book Hub</span>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 w-full max-w-sm mx-4 px-8 py-8">

                {/* heading */}
                <div className="text-center text-xl font-semibold text-slate-800 mb-1">{role}'s Portal</div>

                {"Author" == role ? <div className="text-center text-sm text-slate-400 mb-6">Welcome back! Please sign in.</div> : ""}

                {/* Show Error */}
                <small className="text-red-600 py-2 font-semibold">{errorMsg ? errorMsg : ""}</small>

                {/* login form */}
                <form onSubmit={(e) => handleLoginSubmit(e)} className="flex flex-col gap-4">

                    {/* email input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600" htmlFor="loginEmail">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="loginEmail"
                            placeholder="you@example.com"
                            required
                            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* password input */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-600" htmlFor="loginPass">Password</label>
                        </div>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                id="loginPass"
                                placeholder="••••••••"
                                required
                                className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full pr-8"
                            />
                            <i
                                className={`fa-regular ${showPass ? "fa-eye-slash" : "fa-eye"} fa-sm absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 hover:cursor-pointer`}
                                onClick={() => setShowPass(v => !v)}
                            ></i>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    {
                        "Author" == role ?
                            <Link to="/author/forgot-password" className="text-xs text-blue-600 hover:underline text-end">Forgot password?</Link>
                            : ""
                    }

                    {/* submit */}
                    <input
                        type="submit"
                        value="Log in"
                        className="mt-1 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white cursor-pointer transition hover:opacity-90 active:scale-95"
                        style={{ background: "#166bba" }}
                    />
                </form>
            </div>
        </div>
    )
}