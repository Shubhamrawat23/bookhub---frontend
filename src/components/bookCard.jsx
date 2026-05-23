import React from "react";

export default function BookCard({
    book_id,
    title,
    isbn,
    genre,
    publication_date,
    status,
    mrp,
    author_royalty_per_copy,
    total_copies_sold,
    total_royalty_earned,
    royalty_paid,
    royalty_pending,
    last_royalty_payout_date,
    print_partner,
    available_on
}) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-5 w-full max-w-sm flex flex-col gap-4">

            {/* Top - Title & Status */}
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-slate-800 font-bold text-lg tracking-tight leading-tight">{title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{book_id} &bull; {isbn}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#166bba] whitespace-nowrap">
                    {status ?? "N/A"}
                </span>
            </div>

            {/* Genre */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <i className="fa-solid fa-bookmark text-[#166bba] fa-sm"></i>
                <span>{genre ?? "N/A"}</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100"></div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">MRP</p>
                    <p className="text-sm font-semibold text-slate-700">
                        {mrp != null ? `₹${mrp}` : "N/A"}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Royalty / Copy</p>
                    <p className="text-sm font-semibold text-slate-700">
                        {author_royalty_per_copy != null ? `₹${author_royalty_per_copy}` : "N/A"}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Copies Sold</p>
                    <p className="text-sm font-semibold text-slate-700">{total_copies_sold ?? 0}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Total Royalty</p>
                    <p className="text-sm font-semibold text-slate-700">
                        {total_royalty_earned != null ? `₹${total_royalty_earned}` : "N/A"}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Royalty Paid</p>
                    <p className="text-sm font-semibold text-green-600">
                        {royalty_paid != null ? `₹${royalty_paid}` : "N/A"}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">Royalty Pending</p>
                    <p className="text-sm font-semibold text-red-500">
                        {royalty_pending != null ? `₹${royalty_pending}` : "N/A"}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100"></div>

            {/* Bottom Meta */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                    <span>Publication Date</span>
                    <span className="font-medium text-slate-700">{publication_date ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Last Payout</span>
                    <span className="font-medium text-slate-700">{last_royalty_payout_date ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Print Partner</span>
                    <span className="font-medium text-slate-700">{print_partner ?? "N/A"}</span>
                </div>
            </div>

            {/* Available On */}
            <div>
                <p className="text-xs text-slate-400 mb-1.5">Available On</p>
                {available_on && available_on.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {available_on.map((platform, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#166bba] font-medium">
                                {platform}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">Not listed yet</span>
                )}
            </div>
        </div>
    )
}