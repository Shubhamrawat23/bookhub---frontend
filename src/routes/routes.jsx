import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthorLogin from "../pages/author/authorLogin";
import AdminLogin from "../pages/admin/adminLogin";
import AuthorPasswordSet from "../pages/author/authorPasswordSet";
import AuthorLayout from "../layouts/authorLayout";
import AdminLayout from "../layouts/adminLayout";
import AuthorBook from "../pages/author/authorBook";
import AuthorTicket from "../pages/author/authorTickets";
import AuthorTicketChat from "../pages/author/authorTktChat";
import AdminTickets from "../pages/admin/adminTkts";
import AdminTicketDetailsUpdate from "../pages/admin/adminTktDetailsUpdate";

export default function Router(){
    return (
        <BrowserRouter>
            <Routes>
                {/* Author Login */}
                <Route path="/" element={<Navigate to="/author/login"/>}></Route>
                <Route path="/author/login" element={<AuthorLogin/>}></Route>
                <Route path="/author/forgot-password" element={<AuthorPasswordSet/>}></Route>

                {/* author portal routes*/}

                <Route path="/author" element={<AuthorLayout/>}>
                    <Route path="books" element={<AuthorBook/>}></Route>
                    <Route path="tickets" element={<AuthorTicket/>}></Route>
                    <Route path="tickets/chat/:ticket_code" element={<AuthorTicketChat/>}></Route>
                </Route>


                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin/>}></Route>

                {/* author portal routes*/}
                <Route path="/admin" element={<AdminLayout/>}>
                    <Route path="query-tickets" element={<AdminTickets/>}></Route>
                    <Route path="ticket-detail/:ticket_code" element={<AdminTicketDetailsUpdate/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}