import React, { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../config.js";
import { useStore } from "../../store/store.jsx";
import TicketCard from "../../components/ticketCard.jsx";
import NewTicketModal from "../../components/newTktModel.jsx";
import { useNavigate } from "react-router-dom";

export default function AuthorTickets() {
    const { authorLoginData, setTktData, setAuthorLoginData } = useStore();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(true);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const pollingTktList = useRef(null)
    const navigate = useNavigate()

    const fetchTickets = useCallback((showLoader = false)=>{
        if (!authorLoginData?.author_id) return;
        if (showLoader) setLoading(true);

        fetch(`${BASE_URL}/ticket/author/list`, {
            method: "GET",
            headers: { 
                "Accept": "application/json",
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}`
            }
        })
        .then((resp) => resp.json())
        .then((result) => {
            if (result?.detail?.code == 401) {
                setAuthorLoginData({})
                clearInterval(pollingTktList.current);
                alert(result.detail.error)
                navigate("/author/login")
                return;
            }
            if (result.code === 200) {
                setTickets(result.data);
            } else {
                setError(result.message);
            }
        })
        .catch((err) => {
            console.error(err);
            setError("Something went wrong. Please try again.");
        })
        .finally(() => setLoading(false));
    },[])


    // empty tkt data in store
    // useEffect(() => {
    //     setTktData({});
    // }, [])


    useEffect(() => {
        if (!authorLoginData?.author_id) return;
        fetchTickets(true);
        pollingTktList.current = setInterval(()=>fetchTickets(false),5000)

        return ()=>clearInterval(pollingTktList.current)
    }, [authorLoginData]);


    // handle books list for new tkt
    const fetchBooks = useCallback(() => {
        if (!authorLoginData?.author_id) return;
        setBooksLoading(true);

        fetch(`${BASE_URL}/author/book/list`, {
            method: "GET",
            headers: { 
                "Accept": "application/json",
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}`
            }
        })
        .then((resp) => resp.json())
        .then((result) => {
            if (result.code === 200) {
                setBooks(result.data);
            }
        })
        .catch((err) => console.error("Books fetch error:", err))
        .finally(() => setBooksLoading(false));

    }, [authorLoginData?.author_id]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleChat = (ticketId) => {
        console.log("Open chat for ticket:", ticketId);
        // navigate to chat page or open modal
    }

    // Loading
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Loading tickets...
            </div>
        </div>
    );

    // Error
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

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-800 font-bold text-xl tracking-tight">
                    My Tickets
                    <span className="ml-2 text-sm font-medium text-[#166bba] bg-blue-50 px-2 py-0.5 rounded-full">
                        {tickets.length}
                    </span>
                </h2>

                {showNewTicket && (
                    <NewTicketModal
                        onClose={() => setShowNewTicket(false)}
                        onSuccess={() => fetchTickets(false)}
                        books={books}
                    />
                )}
                <button
                    onClick={() => setShowNewTicket(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#166bba] hover:opacity-90 transition active:scale-95"
                >
                    <i className="fa-solid fa-plus fa-sm"></i>
                    New Ticket
                </button>
            </div>

            {/* Empty */}
            {tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
                    <i className="fa-solid fa-ticket fa-2x text-slate-200"></i>
                    <p className="text-sm">No tickets raised yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket.id}
                            {...ticket}
                            onChat={handleChat}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}