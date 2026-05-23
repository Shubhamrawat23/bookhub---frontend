import React, { useState } from "react";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [errorMsg, setErrorMsg] = useState(null)
    const [showNewPass, setShowNewPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const navigate = useNavigate()

    const handleForgotPassSubmit = (e) => {
        e.preventDefault()

        const data = new FormData(e.target);

        const email = data.get("email")
        const new_password = data.get("new_password")
        const confirm_password = data.get("confirm_password")

        fetch(`${BASE_URL}/auth/author/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, new_password, confirm_password })
        })
            .then((resp) => resp.json())
            .then((result) => {
                setErrorMsg(null)
                if (result.code == 404) {
                    setErrorMsg(result.message)
                }
                if (result.code == 422) {
                    setErrorMsg(result.message)
                }

                if (result.code == 200) {
                    alert(result.message)
                    navigate("/author/login")
                }
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className="flex flex-col justify-center items-center m-auto h-screen bg-slate-50">
            {/* ICON */}
            <div className="flex items-center gap-2 text-2xl font-bold py-3 mb-2">
                <i className="fa-solid fa-book-open fa-xl" style={{ color: "#166bba" }}></i>
                <span className="text-slate-800 tracking-tight">Book Leaf</span>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 w-full max-w-sm mx-4 px-8 py-8">

                {/* heading */}
                <div className="text-center text-xl font-semibold text-slate-800 mb-1">Author's Password Reset</div>

                {/* Show Error */}
                <small className="text-red-600 py-2 font-semibold">{errorMsg ? errorMsg : ""}</small>

                {/* login form */}
                <form onSubmit={(e) => handleForgotPassSubmit(e)} className="flex flex-col gap-4">

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

                    {/* New password input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600" htmlFor="loginPass">New Password</label>
                        <div className="flex justify-between items-center relative">
                            <input
                                type={showNewPass ? "text" : "password"}
                                name="new_password"
                                placeholder="••••••••"
                                required
                                className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full pr-8"
                            />
                            <i
                                className={`fa-regular ${showNewPass ? "fa-eye-slash" : "fa-eye"} fa-sm absolute right-2 opacity-50 hover:opacity-100 hover:cursor-pointer`}
                                onClick={() => setShowNewPass(v => !v)}
                            ></i>
                        </div>
                    </div>

                    {/* Confirm password input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600" htmlFor="loginPass">Confirm Password</label>
                        <div className="flex justify-between items-center relative">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                name="confirm_password"
                                placeholder="••••••••"
                                required
                                className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full pr-8"
                            />
                            <i
                                className={`fa-regular ${showConfirmPass ? "fa-eye-slash" : "fa-eye"} fa-sm absolute right-2 opacity-50 hover:opacity-100 hover:cursor-pointer`}
                                onClick={() => setShowConfirmPass(v => !v)}
                            ></i>
                        </div>
                    </div>

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