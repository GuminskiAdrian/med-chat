import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDMGt4UfjVgGFfvux2EvTrqaSdhutbeZw8",
    authDomain: "med-chat-5e6a0.firebaseapp.com",
    projectId: "med-chat-5e6a0",
    storageBucket: "med-chat-5e6a0.appspot.com",
    messagingSenderId: "1097086323549",
    appId: "1:1097086323549:web:0c98e4920bf13deb9e76b4"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);