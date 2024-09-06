import React from "react";
import "./styles/app.css";

function App() {
    return (
        <div className="Forms">
            <div className="loginForm">
                <h1>Zaloguj się</h1>
                <div className="inputs">
                    <input type="text" name="login" placeholder="Email" />
                    <input
                        type="password"
                        name="password"
                        placeholder="hasło"
                    />
                    <input type="button" value="Zaloguj się" id="login" />
                </div>
            </div>
            <div className="registerForm">
                <h1>Załóż konto</h1>
                <div className="inputs">
                    <input type="text" name="login" placeholder="Email" />
                    <input
                        type="password"
                        name="password"
                        placeholder="hasło"
                    />
                    <input type="text" name="imie" placeholder="Imię" />
                    <input type="text" name="surrname" placeholder="Nazwisko" />
                    <input type="button" value="Załóż konto" id="register" />
                </div>
            </div>
        </div>
    );
}

export default App;
