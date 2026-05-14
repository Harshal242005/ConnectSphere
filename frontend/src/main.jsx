import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./axiosConfig";
import { UserContextProvider } from "./context/UserContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <UserContextProvider>
      <SocketContextProvider>
       
        <PostContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </PostContextProvider>
      </SocketContextProvider>{" "}
    
    </UserContextProvider>{" "}
  </>,
);