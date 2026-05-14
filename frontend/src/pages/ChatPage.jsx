import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext.jsx";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat.jsx";
import MessageContainer from "../components/chat/MessageContainer.jsx";
import { SocketData } from "../context/SocketContext";



const ChatPage = ({ user }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } =
    ChatData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const { unreadCount, setUnreadCount } = ChatData();


  async function fetchAllUsers() {
    try {
      const { data } = await axios.get("/api/user/all?search=" + query);

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/messages/chats");
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  async function createNewChat(id) {
    await createChat(id);
    setSearch(false);
    getAllChats();
  }

  const { onlineUsers = [], socket = null } = SocketData() || {};


  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      console.log("selectedChat:", selectedChat); // 👈
      console.log("message.chatId:", message.chatId); // 👈
      console.log(
        "condition:",
        !selectedChat || selectedChat._id !== message.chatId,
      ); // 👈

      if (!selectedChat || selectedChat._id !== message.chatId) {
        
        setUnreadCount((prev) =>{ 
          console.log("incrementing unread, prev:", prev);  
          return prev + 1;}); // 👈 increment
      }

      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat._id === message.chatId
            ? { ...chat, latestMessage: message }
            : chat,
        );
        return updated.sort(
          (a, b) =>
            new Date(b.latestMessage?.createdAt) -
            new Date(a.latestMessage?.createdAt),
        );
      });
    });

    return () => socket.off("newMessage");
  }, [socket]);

  return (
    <div className="w-[100%] md:w-[750px] md:p-4">
      <div className="flex gap-4 mx-auto">
        <div className="w-[30%]">
          <div className="top">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
              onClick={() => setSearch(!search)}
            >
              {search ? "X" : <FaSearch />}
            </button>
            {search ? (
              <>
                <input
                  type="text"
                  className="custom-input"
                  style={{ width: "100px", border: "gray solid 1px" }}
                  placeholder="Enter name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <div className="users">
                  {users && users.length > 0 ? (
                    users.map((e) => (
                      <div
                        key={e._id}
                        onClick={() => createNewChat(e._id)}
                        className="bg-gray-500 text-white p-2 mt-2 cursor-pointer flex justify-center items-center gap-2"
                      >
                        <img
                          src={e.profilePic.url}
                          className="w-8 h-8 rounded-full"
                          alt=""
                        />
                        {e.name}
                      </div>
                    ))
                  ) : (
                    <p>No Users</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center mt-2">
                {chats.map((e) => (
                  <Chat
                    key={e._id}
                    chat={e}
                    setSelectedChat={setSelectedChat}
                    isOnline={onlineUsers.includes(e.users[0]._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedChat === null ? (
          <div className="w-[70%] mx-20 mt-40 text-2xl">
            Hello 👋 {user.name} select a chat to start conversation
          </div>
        ) : (
          <div className="w-[70%]">
            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
