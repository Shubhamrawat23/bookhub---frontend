// components/NewTicketModal.jsx
import React, { useState } from "react";
import { BASE_URL } from "../config";
import { useStore } from "../store/store.jsx";

const CATEGORY_OPTIONS = [
    { value: "", label: "Select a category" },
    { value: "General Level", label: "General Level" },
    { value: "Account Level", label: "Account Level" },
];

export default function NewTicketModal({ onClose, onSuccess, books = [] }) {
    const { authorLoginData } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attachment, setAttachment] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        
        if (file) setAttachment(file.name);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        // Build multipart/form-data payload
        const formData = new FormData();
        // formData.append("author_id", authorLoginData?.author_id);
        formData.append("book_id", data.get("book_id"));
        formData.append("subject", data.get("subject"));
        formData.append("description", data.get("description"));
        formData.append("category", data.get("category"));

        // Append file only if selected
        const file = data.get("attachment");
        if (file && file.size > 0) {
            formData.append("file", file);
        } else {
            formData.append("file", "");
        }

        setLoading(true);
        setError(null);

        fetch(`${BASE_URL}/ticket/author/create`, {
            method: "POST",
            headers:{
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}`
            },
            body: formData
        })
            .then((resp) => resp.json())
            .then((result) => {
                if (result.code === 200 || result.code === 201) {
                    onSuccess();
                    onClose();
                } else {
                    setError(result.message);
                }
            })
            .catch(() => setError("Something went wrong. Please try again."))
            .finally(() => setLoading(false));

    }

    return (
        // Overlay
        <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-slate-800 font-bold text-lg tracking-tight">New Support Ticket</h2>
                        <p className="text-slate-400 text-xs mt-0.5">Fill in the details below and we'll get back to you.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5 overflow-y-auto max-h-[70vh]">

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                            <i className="fa-solid fa-circle-exclamation fa-sm"></i>
                            {error}
                        </div>
                    )}

                    {/* Book */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">Related Book <span className="text-red-400">*</span></label>
                        <select
                            name="book_id"
                            required
                            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="">Select Book</option>
                            {books.map((book) => (
                                <option key={book.book_id} value={book.book_id}>
                                    {book.title} ({book.book_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">Category <span className="text-red-400">*</span></label>
                        <select
                            name="category"
                            required
                            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">Subject <span className="text-red-400">*</span></label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Brief summary of your issue"
                            required
                            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">Description <span className="text-red-400">*</span></label>
                        <textarea
                            name="description"
                            placeholder="Describe your issue in detail..."
                            required
                            rows={4}
                            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        />
                    </div>

                    {/* Attachment - UI only */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">
                            Attachment <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <label className="flex items-center gap-3 border border-dashed border-slate-300 bg-slate-50 rounded-lg px-3 py-3 cursor-pointer hover:border-[#166bba] hover:bg-blue-50 transition group">
                            <i className="fa-solid fa-cloud-arrow-up text-slate-400 group-hover:text-[#166bba] transition"></i>
                            <span className="text-sm text-slate-400 group-hover:text-[#166bba] transition">
                                {attachment ? attachment : "Click to upload a file"}
                            </span>
                            <input
                                type="file"
                                name="attachment"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#166bba] hover:opacity-90 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <><i className="fa-solid fa-spinner fa-spin fa-sm"></i> Submitting...</>
                                : <><i className="fa-solid fa-paper-plane fa-sm"></i> Submit Ticket</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
