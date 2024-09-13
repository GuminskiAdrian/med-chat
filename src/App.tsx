import React from "react";
import Login from "./components/Login";
import Chats from "./components/Chats";
import Chat from "./components/Chat";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/chats/:chatId" element={<Chat />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
