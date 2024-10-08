import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import '../styles/chats.css';
import { signOut } from "firebase/auth";

function Chats() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;

                    const q = query(
                        collection(db, "Chats"),
                        where("participants", "array-contains", userId)
                    );

                    const querySnapshot = await getDocs(q);
                    const chatsData: any[] = [];

                    querySnapshot.forEach((doc) => {
                        chatsData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    setChats(chatsData);
                }
            } catch (error) {
                console.error("Error fetching chats: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleLogout = async ()=> {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout error: ", error);
        }
    }

    const openChat = (chatId: string) => {
        navigate(`/chats/${chatId}`);
    }

    if (loading) {
        return <div>Ładowanie czatów...</div>;
    }

    return (
        <div className="chatsContainer">
            <h1>Twoje Czaty</h1>
            <input type="button" value="wyloguj mnie" onClick={handleLogout} />
            {chats.length === 0 ? (
                <p>Brak dostępnych czatów</p>
            ) : (
                <ul>
                    {chats.map((chat) => (
                        <li key={chat.id} onClick={ () => openChat(chat.id)}>
                            <p>{chat.name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Chats;
