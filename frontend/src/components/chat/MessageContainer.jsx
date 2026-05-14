import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/SocketContext";
import { ChatData } from "../../context/ChatContext";

axios.defaults.withCredentials = true;

const MessageContainer = ({ selectedChat, setChats }) => {
  // ✅ ALL hooks at the top, no conditions before any hook
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UserData();
  const { socket } = SocketData();
  const messageContainerRef = useRef(null);
  const { setUnreadCount } = ChatData();


  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.on("newMessage", (message) => {
      console.log("Socket received:", message);
      if (selectedChat._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                latestMessage: {
                  text: message.text,
                  sender: message.sender,
                },
              }
            : chat,
        ),
      );
    });

    return () => socket.off("newMessage");
  }, [socket, selectedChat, setChats]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
    setUnreadCount(0);
  }, [selectedChat]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/messages/" + selectedChat.users[0]._id,
      );
      setMessages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {selectedChat && (
        <div className="flex flex-col">
          <div className="flex w-full h-12 items-center gap-3">
            <img
              src={selectedChat.users[0]?.profilePic?.url || ""}
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <span>{selectedChat.users[0].name}</span>
          </div>
          {loading ? (
            <LoadingAnimation />
          ) : (
            <>
              <div
                ref={messageContainerRef}
                className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3"
              >
                {messages &&
                  (() => {
                    let lastDate = null;
                    return messages.map((e) => {
                      const messageDate = new Date(e.createdAt);
                      const today = new Date();
                      const yesterday = new Date();
                      yesterday.setDate(today.getDate() - 1);

                      const isToday =
                        messageDate.toDateString() === today.toDateString();
                      const isYesterday =
                        messageDate.toDateString() === yesterday.toDateString();
                      const dateStr = isToday
                        ? "Today"
                        : isYesterday
                          ? "Yesterday"
                          : messageDate.toLocaleDateString([], {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });

                      const showDateSeparator = lastDate !== dateStr;
                      lastDate = dateStr;

                      return (
                        <React.Fragment key={e._id}>
                          {showDateSeparator && (
                            <div className="flex items-center gap-2 my-2">
                              <div className="flex-1 h-px bg-gray-300" />
                              <span className="text-xs text-gray-500 px-2">
                                {dateStr}
                              </span>
                              <div className="flex-1 h-px bg-gray-300" />
                            </div>
                          )}
                          <Message
                            message={e.text}
                            ownMessage={e.sender === user._id}
                            createdAt={e.createdAt}
                          />
                        </React.Fragment>
                      );
                    });
                  })()}
              </div>
              <MessageInput
                setMessages={setMessages}
                selectedChat={selectedChat}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
