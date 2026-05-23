import React from "react";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

const STATUS_MAP = {
    0: { label: "Open", classes: "bg-green-50 text-green-600" },
    1: { label: "In Progress", classes: "bg-yellow-50 text-yellow-600" },
    2: { label: "Resolved", classes: "bg-blue-50 text-[#166bba]" },
    3: { label: "Closed", classes: "bg-slate-100 text-slate-400" }
};

const PRIORITY_MAP = {
    1: { label: "Critical", classes: "text-red-500", icon: "fa-solid fa-circle-exclamation" },
    2: { label: "High", classes: "text-orange-500", icon: "fa-solid fa-angle-double-up" },
    3: { label: "Medium", classes: "text-yellow-500", icon: "fa-solid fa-minus" },
    4: { label: "Low", classes: "text-slate-400", icon: "fa-solid fa-angle-down" }
};

const TicketCard = React.memo(({ id, ticket_code, subject, description, category, status, priority, attachment_url, created_at }) => {

    
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    const statusInfo = STATUS_MAP[status] ?? STATUS_MAP[0];
    const priorityInfo = PRIORITY_MAP[priority] ?? PRIORITY_MAP[4];

    const navigate = useNavigate()

    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">

            {/* Top - Code & Date */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#166bba] bg-blue-50 px-2.5 py-1 rounded-full">
                    {ticket_code}
                </span>
                <span className="text-xs text-slate-400">{formatDate(created_at)}</span>
            </div>

            {/* Subject */}
            <h3 className="text-slate-800 font-semibold text-base leading-tight">{subject}</h3>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{description}</p>

            {/* Divider */}
            <div className="h-px bg-slate-100"></div>

            {/* Status & Priority & Category */}
            <div className="flex items-center gap-2 flex-wrap">

                {/* Status */}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.classes}`}>
                    {statusInfo.label}
                </span>

                {/* Priority */}
                <span className={`flex items-center gap-1 text-xs font-medium ${priorityInfo.classes}`}>
                    <i className={`${priorityInfo.icon} fa-sm`}></i>
                    {priorityInfo.label}
                </span>

                {/* Category */}
                {category && (
                    <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                        {category}
                    </span>
                )}
            </div>

            {/* Attachment */}
            {attachment_url && (
                <a
                    href={BASE_URL + "/" + attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#166bba] hover:underline w-fit"
                >
                    <i className="fa-solid fa-paperclip fa-sm"></i>
                    View Attachment
                </a>
            )}

            <button
                onClick={() => {
                    navigate(`/author/tickets/chat/${ticket_code}`,{state: {tktData:{id,ticket_code,subject,description,category,status,priority,created_at} }})
                }}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium text-[#166bba] border border-[#166bba] hover:bg-blue-50 transition active:scale-95"
            >
                <i className="fa-regular fa-message fa-sm"></i>
                View Chat
            </button>
        </div>
    );
})

export default TicketCard