import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";

function Chat() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesCollection = collection(
                    db,
                    "Chats",
                    chatId as string,
                    "messages"
                );

                const q = query(
                    messagesCollection,
                    orderBy("createdAt", "asc")
                );

                onSnapshot(q, (querySnapshot) => {
                    const messagesData: any[] = [];
                    querySnapshot.forEach((doc) => {
                        messagesData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    setMessages(messagesData);
                });
            } catch (error) {
                console.error("Error fetching messages: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (chatId) {
            fetchMessages();
        }
    }, [chatId]);

    const sendMessage = async () => {
        if (newMessage.trim() === "" || !currentUser) return;

        try {
            await addDoc(
                collection(db, "Chats", chatId as string, "messages"),
                {
                    text: newMessage,
                    sender: currentUser.uid,
                    createdAt: new Date(),
                }
            );

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    if (loading) {
        return <div>Ładowanie wiadomości...</div>;
    }

    return (
        <div className="chatContainer">
            <h1>Wiadomości z chatu</h1>
            <div className="messagesContainer">
                {messages.length === 0 ? (
                    <p>No messages available</p>
                ) : (
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <p>
                                    <strong>
                                        {message.sender === currentUser?.uid
                                            ? "You"
                                            : message.sender}
                                        :
                                    </strong>{" "}
                                    {message.text}
                                </p>
                                <small>
                                    {new Date(
                                        message.createdAt.seconds * 1000
                                    ).toLocaleTimeString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="messageInput">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Wyślij</button>
            </div>
        </div>
    );
}

export default Chat;
