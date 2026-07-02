import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import {useStore} from "../../store/store";
import BookCard from "../../components/bookCard";
import { useNavigate } from "react-router-dom";

export default function AuthorBook() {
    const { authorLoginData } = useStore();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    
    useEffect(() => {
        
        if (!authorLoginData?.author_id) return;

        fetch(`${BASE_URL}/author/book/list`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `${authorLoginData.token_type} ${authorLoginData.access_token}`
            }
        })
        .then((resp) => resp.json())
        .then((result) => {
            if (result?.detail?.code == 401) {
                alert(result.message)
                navigate("/author/login")
            }

            if (result.code == 200) {
                setBooks(result.data);
            }
        })
        .catch((err) => {
            console.error(err);
            setError("Something went wrong. Please try again.");
        })
        .finally(() => setLoading(false));

    }, [authorLoginData]);

    // Loading
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-[#166bba]"></i>
                Loading books...
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

    // Empty
    if (books.length === 0) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                <i className="fa-solid fa-book-open fa-2x text-slate-200"></i>
                No books found.
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <h2 className="text-slate-800 font-bold text-xl tracking-tight mb-6">
                My Books
                <span className="ml-2 text-sm font-medium text-[#166bba] bg-blue-50 px-2 py-0.5 rounded-full">
                    {books.length}
                </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {books.map((book) => (
                    <BookCard key={book.book_id} {...book} />
                ))}
            </div>
        </div>
    );
}