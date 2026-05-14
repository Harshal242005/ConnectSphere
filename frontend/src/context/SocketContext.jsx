import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserContext } from "./UserContext"; // ✅ import Context directly

const EndPoint = "http://localhost:7000";
const SocketContext = createContext({ socket: null, onlineUsers: [] });

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(UserContext); // ✅ useContext directly, not UserData()

  useEffect(() => {
    console.log("user in socket effect:", user);
    if (!user?._id) return;

    const newSocket = io(EndPoint, {
      query: { userId: user._id },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUser", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.close();
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
