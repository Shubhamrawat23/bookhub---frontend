import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { useStore } from "../../store/store";

const STATUS_MAP = {
    0: { label: "Open", classes: "bg-green-50 text-green-600" },
    1: { label: "In Progress", classes: "bg-yellow-50 text-yellow-600" },
    2: { label: "Resolved", classes: "bg-blue-50 text-[#166bba]" },
    3: { label: "Closed", classes: "bg-slate-100 text-slate-400" }
};

const PRIORITY_MAP = {
    1: { label: "Critical", classes: "text-red-500", bg: "bg-red-50" },
    2: { label: "High", classes: "text-orange-500", bg: "bg-orange-50" },
    3: { label: "Medium", classes: "text-yellow-500", bg: "bg-yellow-50" },
    4: { label: "Low", classes: "text-slate-400", bg: "bg-slate-50" }
};

export default function AdminTickets() {
    const navigate = useNavigate();
    const { adminLoginData } = useStore();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const pollingRef = useRef(null);


    const fetchTickets = useCallback((showLoader = false) => {
        if (showLoader) setLoading(true);

        // const params = new URLSearchParams({
        //     author_id: "all",
        //     admin_code: adminLoginData?.admin_code ?? ""
        // });
        
        const params = new URLSearchParams();
        if (status) params.append("status_filter", status);
        if (category) params.append("category_filter", category);
        if (priority) params.append("priority_filter", priority);
        if (startDate) params.append("start_date_tz", toStartTZ(startDate));
        if (endDate) params.append("end_date_tz", toEndTZ(endDate));

        fetch(`${BASE_URL}/ticket/admin/list?${params.toString()}`, {
            method: "GET",
            headers: { "accept": "application/json", "Authorization": `${adminLoginData.token_type} ${adminLoginData.access_token}` }
        })
            .then(r => r.json())
            .then(result => {
                if (result.code === 200) {
                    setTickets(result.data);
                    setError(null);
                } else {
                    setError(result.message);
                }
            })
            .catch(() => setError("Something went wrong."))
            .finally(() => setLoading(false));

    }, [adminLoginData?.admin_code, status, category, priority, startDate, endDate]);

    useEffect(() => {
        fetchTickets(true);
        pollingRef.current = setInterval(() => fetchTickets(false), 5000);
        return () => clearInterval(pollingRef.current);
    }, [fetchTickets]);

    const urgentCount = useMemo(() =>
        tickets.filter(t => (t.priority <= 2) && (t.status <= 1)).length
        , [tickets]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    }

    const toStartTZ = (dateStr) => {
        if (!dateStr) return "";
        return `${dateStr} 00:00:00.000000+05:30`;
    }

    const toEndTZ = (dateStr) => {
        if (!dateStr) return "";
        return `${dateStr} 23:59:59.999999+05:30`;
    }

    const resetFilters = () => {
        setStatus("");
        setCategory("");
        setPriority("");
        setStartDate("");
        setEndDate("");
    }

    const isFiltered = status || category || priority || startDate || endDate;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Loading tickets...
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-red-500 text-sm">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
            </div>
        </div>
    );

    return (
        <div className="p-6">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-slate-800 font-bold text-xl tracking-tight">
                        Query Tickets
                        <span className="ml-2 text-sm font-medium text-[#166bba] bg-blue-50 px-2 py-0.5 rounded-full">
                            {tickets.length}
                        </span>
                    </h2>
                    {urgentCount > 0 && (
                        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                            <i className="fa-solid fa-circle-exclamation fa-sm"></i>
                            {urgentCount} unresolved {urgentCount === 1 ? "ticket" : "tickets"} need attention
                        </p>
                    )}
                </div>
                {isFiltered && (
                    <button onClick={resetFilters}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition">
                        <i className="fa-solid fa-xmark fa-sm"></i>
                        Reset Filters
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <select value={status} onChange={e => setStatus(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">All Status</option>
                    <option value="0">Open</option>
                    <option value="1">In Progress</option>
                    <option value="2">Resolved</option>
                    <option value="3">Closed</option>
                </select>

                <select value={category} onChange={e => setCategory(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">All Categories</option>
                    <option value="General Level">General Level</option>
                    <option value="Account Level">Account Level</option>
                </select>

                <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">All Priority</option>
                    <option value="1">Critical</option>
                    <option value="2">High</option>
                    <option value="3">Medium</option>
                    <option value="4">Low</option>
                </select>

                <div className="relative col-span-2 sm:col-span-2">
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                        <i className="fa-regular fa-calendar text-slate-400 fa-sm flex-shrink-0"></i>
                        <input
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={e => setStartDate(e.target.value)}
                            className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent min-w-0"
                        />
                        <span className="text-slate-300 text-xs flex-shrink-0">→</span>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={e => setEndDate(e.target.value)}
                            className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent min-w-0"
                        />
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                                className="text-slate-300 hover:text-red-400 transition flex-shrink-0"
                            >
                                <i className="fa-solid fa-xmark fa-xs"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Ticket</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Author</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Subject</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Category</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Priority</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Date</th>
                                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center text-slate-400 py-16">
                                        <i className="fa-solid fa-ticket fa-2x text-slate-200 block mb-2"></i>
                                        No tickets found.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((tkt) => {
                                    const statusInfo = STATUS_MAP[tkt.status] ?? STATUS_MAP[0];
                                    const priorityInfo = PRIORITY_MAP[tkt.priority] ?? PRIORITY_MAP[4];
                                    const isUrgentOld = tkt.priority <= 2 && tkt.status < 1;

                                    return (
                                        <tr key={tkt.id}
                                            className={`transition ${isUrgentOld ? "bg-red-50/40 hover:bg-red-50" : "hover:bg-slate-50"}`}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    {isUrgentOld && <i className="fa-solid fa-circle-exclamation text-red-400 fa-sm"></i>}
                                                    <span className="text-xs font-semibold text-[#166bba] bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                                                        {tkt.ticket_code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                                                {tkt.author_name ?? tkt.author_id}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600 max-w-[180px] truncate">
                                                {tkt.subject}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                                                {tkt.category ?? "—"}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityInfo.classes} ${priorityInfo.bg}`}>
                                                    {priorityInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.classes}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                                                {formatDate(tkt.created_at)}
                                            </td>
                                            <td className="px-5 py-3.5">

                                                <button
                                                    onClick={() => {
                                                        navigate(`/admin/ticket-detail/${tkt.ticket_code}`,{ state: { tkt_authorId: tkt.author_id } });
                                                    }}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-[#166bba] border border-[#166bba] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition active:scale-95 whitespace-nowrap"
                                                >
                                                    <i className="fa-regular fa-message fa-sm"></i>
                                                    Update Ticket
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}