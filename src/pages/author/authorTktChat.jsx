import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import { useStore } from "../../store/store.jsx";

const STATUS_MAP = {
    0: { label: "Open", classes: "bg-green-50 text-green-600" },
    1: { label: "In Progress", classes: "bg-yellow-50 text-yellow-600" },
    2: { label: "Resolved", classes: "bg-blue-50 text-[#166bba]" },
    3: { label: "Closed", classes: "bg-slate-100 text-slate-400" }
};

export default function AuthorTicketChat() {
    const { ticket_code } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const tkt_data = location.state?.tktData;
    const { authorLoginData } = useStore();

    // const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const bottomRef = useRef(null);
    const pollingRef = useRef(null);


    const fetchChat = useCallback((showLoader = false) => {
        if (!authorLoginData?.author_id || !ticket_code) return;
        if (showLoader) setLoading(true);

        fetch(`${BASE_URL}/ticket/author/tkt_chat?tkt_code=${ticket_code}`, {
            method: "GET",
            headers: { 
                "Accept": "application/json",
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}` 
            }
        })
        .then((resp) => resp.json())
        .then((result) => {
            if (result?.detail?.code == 401) {
                alert(result.detail.message)
                navigate("/author/login")
            }
            if (result.code == 400) {
                alert(result.message)
            }
            if (result.code == 404) {
                alert(result.message)
            }

            if (result.code === 200) {
                setMessages(result.data);
                setError(null);
            }
        })
        .catch(() => setError("Something went wrong."))
        .finally(() => {if (showLoader) setLoading(false)});

    }, [authorLoginData?.access_token, ticket_code]);

    useEffect(() => {
        fetchChat(true);
        pollingRef.current = setInterval(() => fetchChat(false), 5000);
        return () => clearInterval(pollingRef.current);
    }, [fetchChat]);

    // Auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message 
    const handleSend = () => {
        if (!message.trim() || sending) return;
        setSending(true);

        fetch(`${BASE_URL}/ticket/author/save_message`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}`
            },
            body: JSON.stringify({
                ticket_code: ticket_code,
                message: message.trim()
            })
        })
            .then((resp) => resp.json())
            .then((result) => {
                if (result?.detail?.code == 401) {
                    alert(result.detail.message)
                    navigate("/author/login")
                }
                if (result.message == 400) {
                    alert(result.message)
                }if (result.code == 422) {
                    alert(result.message)
                }
                if (result.code === 200 || result.code === 201) {
                    setMessage("");
                    fetchChat(false);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setSending(false));
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit"
        });
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    // ── Loading ───────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center h-full min-h-screen">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Loading chat...
            </div>
        </div>
    );

    // ── Error ─────────────────────────────────────────────
    if (error) return (
        <div className="flex items-center justify-center h-full min-h-screen">
            <div className="flex items-center gap-2 text-red-500 text-sm">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
            </div>
        </div>
    );

    const statusInfo = STATUS_MAP[tkt_data?.status] ?? STATUS_MAP[0];
    const isClosed = tkt_data?.status === 3 || tkt_data?.status === 2;

    return (
        <div className="flex flex-col h-[calc(100vh-57px)] bg-slate-50">

            {/* ── Top Bar ───────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 shadow-sm px-5 py-3 flex items-center gap-4">

                {/* Back */}
                <button
                    onClick={() => navigate("/author/tickets")}
                    className="text-slate-400 hover:text-[#166bba] transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
                >
                    <i className="fa-solid fa-arrow-left fa-sm"></i>
                </button>

                {/* Ticket Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#166bba] bg-blue-50 px-2.5 py-0.5 rounded-full">
                            {tkt_data?.ticket_code}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusInfo.classes}`}>
                            {statusInfo.label}
                        </span>
                    </div>
                    <h2 className="text-slate-800 font-semibold text-sm mt-0.5 truncate">
                        {tkt_data?.subject}
                    </h2>
                </div>

                {/* Created At */}
                <span className="text-xs text-slate-400 hidden sm:block">
                    {formatDate(tkt_data?.created_at)}
                </span>
            </div>

            {/* ── Messages ──────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <i className="fa-regular fa-message fa-2x text-slate-200"></i>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isAuthor = msg.sender_type === "author";
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isAuthor ? "justify-end" : "justify-start"}`}
                            >
                                {/* Admin Avatar */}
                                {!isAuthor && (
                                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-semibold mr-2 flex-shrink-0 self-end mb-1">
                                        A
                                    </div>
                                )}

                                <div className={`max-w-[70%] flex flex-col gap-1 ${isAuthor ? "items-end" : "items-start"}`}>
                                    {/* Sender Label */}
                                    <span className="text-xs text-slate-400 px-1">
                                        {isAuthor ? "You" : "Support Team"}
                                    </span>

                                    {/* Bubble */}
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                        ${isAuthor
                                            ? "bg-[#166bba] text-white rounded-br-sm"
                                            : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>

                                    {/* Time */}
                                    <span className="text-xs text-slate-400 px-1">
                                        {formatTime(msg.created_at)}
                                    </span>
                                </div>

                                {/* Author Avatar */}
                                {isAuthor && (
                                    <div className="w-7 h-7 rounded-full bg-[#166bba] flex items-center justify-center text-white text-xs font-semibold ml-2 flex-shrink-0 self-end mb-1">
                                        {authorLoginData?.name?.[0]?.toUpperCase() ?? "A"}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Input Bar ─────────────────────────────── */}
            <div className="bg-white border-t border-slate-100 px-4 py-3">
                {isClosed ? (
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-1">
                        <i className="fa-solid fa-lock fa-sm"></i>
                        This ticket is {statusInfo.label.toLowerCase()}. No further replies allowed.
                    </div>
                ) : (
                    <div className="flex items-end gap-3">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message... (Enter to send)"
                            rows={1}
                            className="flex-1 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || sending}
                            className="w-10 h-10 rounded-xl bg-[#166bba] text-white flex items-center justify-center hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {sending
                                ? <i className="fa-solid fa-spinner fa-spin fa-sm"></i>
                                : <i className="fa-solid fa-paper-plane fa-sm"></i>
                            }
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}