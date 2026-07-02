import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function AdminTicketDetailsUpdate() {
    const { ticket_code } = useParams();
    const navigate = useNavigate();
    const { adminLoginData } = useStore();

    const [tktDetails, setTktDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [newPriority, setNewPriority] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [note, setNote] = useState("");
    const [savingNote, setSavingNote] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState(null);
    const [activeTab, setActiveTab] = useState("chat");

    const bottomRef = useRef(null);
    const chatPollingRef = useRef(null);

    // ── Fetch ticket details (mount + after update) ────────
    const fetchTktDetails = useCallback((showLoader = false) => {
        if (!ticket_code) return;
        if (showLoader) setLoading(true);

        fetch(`${BASE_URL}/ticket/admin/tkt_detail?ticket_code=${ticket_code}`, {
            method: "GET",
            headers: { "accept": "application/json", "Authorization": `${adminLoginData.token_type} ${adminLoginData.access_token}` }
        })
            .then(r => r.json())
            .then(result => {
                if (result?.detail?.code === 401) {
                    alert(result.detail.error)
                    navigate("/admin/login");
                    return;
                }
                if (result.code === 200) {
                    setTktDetails(result.data);
                    setNewStatus(prev => prev === "" ? String(result.data?.status ?? "0") : prev);
                    setNewPriority(prev => prev === "" ? String(result.data?.priority ?? "3") : prev);
                    setError(null);
                } else {
                    setError(result.message);
                }
            })
            .catch(() => setError("Something went wrong."))
            .finally(() => setLoading(false));

    }, [ticket_code, adminLoginData?.access_token, navigate]);

    // Only on mount
    useEffect(() => {
        fetchTktDetails(true);
    }, [fetchTktDetails]);

    // ── Fetch messages (polled every 5s) ───────────────────
    const fetchChat = useCallback(() => {
        if (!ticket_code) return;
        if (!adminLoginData?.admin_id) return;


        fetch(`${BASE_URL}/ticket/admin/tkt_chat?tkt_code=${ticket_code}`, {
            method: "GET",
            headers: { "accept": "application/json", "Authorization": `${adminLoginData.token_type} ${adminLoginData.access_token}` }
        })
            .then(r => r.json())
            .then(result => {
                if (result.code === 200) {
                    setMessages(result.data);
                }
            })
            .catch(err => console.error(err));

    }, [ticket_code]);

    useEffect(() => {
        fetchChat();
        chatPollingRef.current = setInterval(() => fetchChat(), 5000);
        return () => clearInterval(chatPollingRef.current);
    }, [fetchChat]);

    // Auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Generic tkt action helper ──────────────────────────
    const tktAction = async (action, action_val) => {
        const result = await fetch(`${BASE_URL}/ticket/admin/tkt_action`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `${adminLoginData.token_type} ${adminLoginData.access_token}` },
            body: JSON.stringify({
                ticket_code: ticket_code,
                action: action,
                action_val: String(action_val)
            })
        }).then(r => r.json());

        if (result.code === 200) {
            fetchTktDetails(false);
        }
        return result;
    }

    // ── Send message ───────────────────────────────────────
    const handleSend = () => {
        if (!message.trim() || sending) return;
        setSending(true);

        fetch(`${BASE_URL}/ticket/admin/save_message`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${adminLoginData.token_type} ${adminLoginData.access_token}` },
            body: JSON.stringify({
                ticket_code: ticket_code,
                message: message.trim()
            })
        })
            .then(r => r.json())
            .then(result => {
                if (result.code === 200 || result.code === 201) {
                    setMessage("");
                    fetchChat();
                }
            })
            .catch(err => console.error(err))
            .finally(() => setSending(false));
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // ── Update status + priority ───────────────────────────
    const handleUpdate = async () => {
        if (updating) return;
        setUpdating(true);
        setUpdateMsg(null);

        try {
            const statusRes = await tktAction("status", newStatus);
            if (statusRes.code !== 200) {
                setUpdateMsg({ type: "error", text: statusRes.message });
                return;
            }

            const priorityRes = await tktAction("priority", newPriority);
            if (priorityRes.code !== 200) {
                setUpdateMsg({ type: "error", text: priorityRes.message });
                return;
            }

            setTktDetails(priorityRes.data);
            setUpdateMsg({ type: "success", text: "Ticket updated successfully." });

        } catch {
            setUpdateMsg({ type: "error", text: "Update failed." });
        } finally {
            setUpdating(false);
        }
    }

    // ── Assign to self ─────────────────────────────────────
    const handleAssign = async () => {
        try {
            await tktAction("assigned_by", adminLoginData?.admin_id);
            const assignedToRes = await tktAction("assigned_to", adminLoginData?.admin_id);

            if (assignedToRes.code === 200) {
                setTktDetails(assignedToRes.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // ── Save internal note ─────────────────────────────────
    const handleSaveNote = async () => {
        if (!note.trim() || savingNote) return;
        setSavingNote(true);

        try {
            const newNote = {
                admin_id: adminLoginData?.admin_id,
                admin_name: adminLoginData?.name,
                text: note.trim(),
                date: new Date().toISOString()
            }

            let existingNotes = [];
            try {
                existingNotes = JSON.parse(tktDetails?.notes ?? "[]");
            } catch {
                existingNotes = [];
            }

            const updatedNotesArray = [...existingNotes, newNote];
            const updatedNotesString = JSON.stringify(updatedNotesArray);

            const result = await tktAction("notes", updatedNotesString);

            if (result.code === 200 || result.code === 201) {
                setNote("");
                setTktDetails(prev => ({
                    ...prev,
                    notes: updatedNotesString
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNote(false);
        }
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    }

    // Parse notes safely
    const parsedNotes = (() => {
        try {
            return JSON.parse(tktDetails?.notes ?? "[]");
        } catch {
            return [];
        }
    })();

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true
        });
    }

    const statusInfo = STATUS_MAP[tktDetails?.status] ?? STATUS_MAP[0];
    const priorityInfo = PRIORITY_MAP[tktDetails?.priority] ?? PRIORITY_MAP[4];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Loading ticket...
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
        <div className="p-6 bg-slate-50 min-h-screen">

            {/* Header / Meta Bar */}
            <div className="flex items-center gap-3 mb-5">
                <button onClick={() => navigate("/admin/query-tickets")}
                    className="text-slate-400 hover:text-[#166bba] transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-slate-100">
                    <i className="fa-solid fa-arrow-left fa-sm"></i>
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#166bba] bg-blue-50 px-2.5 py-1 rounded-full">
                            {tktDetails?.ticket_code}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.classes}`}>
                            {statusInfo.label}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityInfo.classes} ${priorityInfo.bg}`}>
                            {priorityInfo.label}
                        </span>
                        {tktDetails?.assigned_to && (
                            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                <i className="fa-solid fa-user fa-xs mr-1"></i>
                                {tktDetails.assigned_to}
                            </span>
                        )}
                    </div>
                    <h1 className="text-slate-800 font-bold text-lg tracking-tight mt-1">
                        {tktDetails?.subject}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        By {tktDetails?.author_name ?? tktDetails?.author_id} · {formatDate(tktDetails?.created_at)}
                    </p>
                </div>

                <button onClick={handleAssign}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[#166bba] text-[#166bba] hover:bg-blue-50 transition active:scale-95 whitespace-nowrap">
                    <i className="fa-solid fa-user-check fa-sm"></i>
                    Assign to Me
                </button>
            </div>

            {/* Original Query Context Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex gap-3 mb-5">
                <i className="fa-solid fa-circle-info text-[#166bba] mt-0.5 fa-sm flex-shrink-0"></i>
                <div>
                    <p className="text-xs font-semibold text-[#166bba] mb-0.5">Original Query</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{tktDetails?.description}</p>
                </div>
            </div>

            {/* Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left Area — Dynamic Tabs Panel */}
                <div className="lg:col-span-2 flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden" style={{ height: "600px" }}>

                    <div className="flex border-b border-slate-100">
                        <button onClick={() => setActiveTab("chat")}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition border-b-2
                                ${activeTab === "chat"
                                    ? "border-[#166bba] text-[#166bba]"
                                    : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                            <i className="fa-regular fa-message fa-sm"></i>
                            Chat with Author
                        </button>
                        <button onClick={() => setActiveTab("notes")}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition border-b-2
                                ${activeTab === "notes"
                                    ? "border-[#166bba] text-[#166bba]"
                                    : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                            <i className="fa-solid fa-lock fa-sm"></i>
                            Internal Notes
                            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                {parsedNotes.length}
                            </span>
                        </button>
                    </div>

                    {/* Chat Tab View */}
                    {activeTab === "chat" && (
                        <>
                            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                                        <i className="fa-regular fa-message fa-2x text-slate-200"></i>
                                        <p className="text-sm">No messages yet.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isAdmin = msg.sender_type === "admin";
                                        return (
                                            <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                                {!isAdmin && (
                                                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-semibold mr-2 flex-shrink-0 self-end mb-1">
                                                        {tktDetails?.author_name?.[0]?.toUpperCase() ?? "A"}
                                                    </div>
                                                )}
                                                <div className={`max-w-[70%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                                                    <span className="text-xs text-slate-400 px-1">
                                                        {isAdmin ? "You (Admin)" : tktDetails?.author_name ?? "Author"}
                                                    </span>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                                        ${isAdmin
                                                            ? "bg-[#166bba] text-white rounded-br-sm"
                                                            : "bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm"}`}>
                                                        {msg.message}
                                                    </div>
                                                    <span className="text-xs text-slate-400 px-1">{formatTime(msg.created_at)}</span>
                                                </div>
                                                {isAdmin && (
                                                    <div className="w-7 h-7 rounded-full bg-[#166bba] flex items-center justify-center text-white text-xs font-semibold ml-2 flex-shrink-0 self-end mb-1">
                                                        {adminLoginData?.name?.[0]?.toUpperCase() ?? "A"}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>
                            <div className="border-t border-slate-100 px-4 py-3 flex items-end gap-3">
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Reply to author... (Enter to send)"
                                    rows={1}
                                    className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                />
                                <button onClick={handleSend} disabled={!message.trim() || sending}
                                    className="w-10 h-10 rounded-xl bg-[#166bba] text-white flex items-center justify-center hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                                    {sending
                                        ? <i className="fa-solid fa-spinner fa-spin fa-sm"></i>
                                        : <i className="fa-solid fa-paper-plane fa-sm"></i>}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Internal Notes Tab View */}
                    {activeTab === "notes" && (
                        <>
                            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                                {parsedNotes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                                        <i className="fa-solid fa-lock fa-2x text-slate-200"></i>
                                        <p className="text-sm">No internal notes yet.</p>
                                        <p className="text-xs text-slate-300">Notes are only visible to admins.</p>
                                    </div>
                                ) : (
                                    parsedNotes.map((n, i) => (
                                        <div key={i} className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-yellow-600">
                                                    <i className="fa-solid fa-lock fa-xs mr-1"></i>
                                                    {n.admin_name}
                                                </span>
                                                <span className="text-xs text-slate-400">{formatTime(n.date)}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">{n.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="border-t border-slate-100 px-4 py-3 flex items-end gap-3">
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="Add internal note (not visible to author)..."
                                    rows={1}
                                    className="flex-1 border border-yellow-200 bg-yellow-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition resize-none"
                                />
                                <button onClick={handleSaveNote} disabled={!note.trim() || savingNote}
                                    className="w-10 h-10 rounded-xl bg-yellow-400 text-white flex items-center justify-center hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                                    {savingNote
                                        ? <i className="fa-solid fa-spinner fa-spin fa-sm"></i>
                                        : <i className="fa-solid fa-floppy-disk fa-sm"></i>}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Area — Control Sidepanel */}
                <div className="flex flex-col gap-4">

                    {/* Configuration Management */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
                        <h3 className="text-slate-800 font-semibold text-sm flex items-center gap-2">
                            <i className="fa-solid fa-pen-to-square text-[#166bba] fa-sm"></i>
                            Update Ticket
                        </h3>

                        {updateMsg && (
                            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg
                                ${updateMsg.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                                <i className={`fa-solid ${updateMsg.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"} fa-sm`}></i>
                                {updateMsg.text}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500">Status</label>
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                                className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                <option value="0">Open</option>
                                <option value="1">In Progress</option>
                                <option value="2">Resolved</option>
                                <option value="3">Closed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-500">Priority</label>
                            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
                                className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                                <option value="1">Critical</option>
                                <option value="2">High</option>
                                <option value="3">Medium</option>
                                <option value="4">Low</option>
                            </select>
                        </div>

                        <button onClick={handleUpdate} disabled={updating}
                            className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-[#166bba] hover:opacity-90 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {updating
                                ? <><i className="fa-solid fa-spinner fa-spin fa-sm"></i> Updating...</>
                                : <><i className="fa-solid fa-floppy-disk fa-sm"></i> Save Changes</>}
                        </button>
                    </div>

                    {/* Metadata Readouts */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
                        <h3 className="text-slate-800 font-semibold text-sm flex items-center gap-2">
                            <i className="fa-solid fa-circle-info text-[#166bba] fa-sm"></i>
                            Ticket Info
                        </h3>
                        {tktDetails?.attachment_url && (<div className="flex flex-col gap-2 py-2">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-medium">Attachment</span>
                            </div>
                            {tktDetails?.attachment_url && (
                                <div className="mt-1 max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-sm transition hover:shadow-md">
                                    <img
                                        src={`${BASE_URL}/${tktDetails.attachment_url}`}
                                        alt="Attachment Preview"
                                        className="w-full h-auto max-h-64 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>)
                        }
                        <div className="flex flex-col gap-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Category</span>
                                <span className="text-slate-700 font-medium">{tktDetails?.category ?? "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Author</span>
                                <span className="text-slate-700 font-medium">{tktDetails?.author_name ?? tktDetails?.author_id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Created</span>
                                <span className="text-slate-700 font-medium">{formatDate(tktDetails?.created_at)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Assigned To</span>
                                <span className="text-slate-700 font-medium">{tktDetails?.assigned_to ?? "Unassigned"}</span>
                            </div>
                            {tktDetails?.book_id && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Book Reference</span>
                                    <span className="text-slate-700 font-medium">{tktDetails.book_id}</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}