import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import '../styles/chats.css';

function Chats() {
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className="chatsContainer">
            <h1>Twoje Czaty</h1>
            <input type="button" value="wyloguj mnie" />
            {chats.length === 0 ? (
                <p>Brak dostępnych czatów</p>
            ) : (
                <ul>
                    {chats.map((chat) => (
                        <li key={chat.id}>
                            <p>{chat.name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Chats;
