import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import '../styles/chat.css';
import { useNavigate } from "react-router-dom";

function Chat() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [usersCache, setUsersCache] = useState<{ [uid: string]: any }>({});
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    const fetchUserName = async (uid: string) => {
        if (usersCache[uid]) {
            return usersCache[uid].name + ' ' + usersCache[uid].surname;
        }
        
        console.log(`Fetching user data for UID: ${uid}`);
        try {
            const userDocRef = doc(db, "Users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                setUsersCache((prevCache) => ({
                    ...prevCache,
                    [uid]: userData,
                }));

                return userData.name + " " + userData.surname;
            } else {
                console.error(`No user found for UID: ${uid}`);
            }
        } catch (error) {
            console.error("Error fetching user info: ", error);
        }
        return "Unknown";
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesCollection = collection(
                    db,
                    "Chats",
                    chatId as string,
                    "messages"
                );

                const q = query(messagesCollection, orderBy("createdAt", "asc"));

                onSnapshot(q, async (querySnapshot) => {
                    const messagesData: any[] = [];

                    for (const doc of querySnapshot.docs) {
                        const message = doc.data();
                        const senderName = await fetchUserName(message.sender);
                        messagesData.push({
                            id: doc.id,
                            ...message,
                            senderName,
                        });
                    }

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
    }, [chatId, usersCache]);

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

    const backToChats = async ()=> {
        navigate('/chats');
    }

    return (
        <div className="chatContainer">
            <input type="button" value="powrót do chatów" className="back" onClick={backToChats}/>
            <h1>Wiadomości z chatu</h1>
            <div className="messagesContainer">
                {messages.length === 0 ? (
                    <p></p>
                ) : (
                    <ul>
                        {messages.map((message) => (
                            <li key={message.id}>
                                <p>
                                    <strong>
                                        {message.sender === currentUser?.uid
                                            ? "Twoja wiadomosc"
                                            : message.senderName}
                                        :
                                    </strong>{" "}
                                    {message.text}
                                </p>
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
                <input type="button" value="Wyślij" onClick={sendMessage} id="send"/>
            </div>
        </div>
    );
}

export default Chat;
