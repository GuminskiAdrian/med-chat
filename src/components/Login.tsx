import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../styles/login.css";

function Login() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerSurname, setRegisterSurname] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            console.log("User logged in: ", userCredential.user.uid);
            navigate("/chats");
        } catch (error) {
            console.error("Login error: ", error);
        }
    };

    const addUserToFirestore = async (
        uid: string,
        name: string,
        surname: string
    ) => {
        try {
            await setDoc(doc(db, "Users", uid), {
                name: name,
                surname: surname,
                email: registerEmail,
                role: "patient",
            });
        } catch (error) {
            console.error("Error adding user to firestore: ", error);
        }
    };

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );

            const user = userCredential.user;

            await addUserToFirestore(user.uid, registerName, registerSurname);
            console.log("user registered: ", userCredential.user);
        } catch (error) {
            console.error("registration error: ", error);
        }
    };

    return (
        <div className="Forms">
            <div className="loginForm">
                <h1>Zaloguj się</h1>
                <div className="inputs">
                    <input
                        type="text"
                        name="login"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="hasło"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <input
                        type="button"
                        value="Zaloguj się"
                        id="login"
                        onClick={handleLogin}
                    />
                </div>
            </div>
            <div className="registerForm">
                <h1>Załóż konto</h1>
                <div className="inputs">
                    <input
                        type="text"
                        name="login"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="hasło"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                    <input
                        type="text"
                        name="imie"
                        placeholder="Imię"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                    />
                    <input
                        type="text"
                        name="surname"
                        placeholder="Nazwisko"
                        value={registerSurname}
                        onChange={(e) => setRegisterSurname(e.target.value)}
                    />
                    <input type="button" value="Załóż konto" id="register" onClick={handleRegister}/>
                </div>
            </div>
        </div>
    );
}

export default Login;
