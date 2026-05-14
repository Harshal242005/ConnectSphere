import React from "react";

const Message = ({ ownMessage, message, createdAt }) => {
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`mb-2 ${ownMessage ? "text-right" : "text-left"}`}>
      <span
        className={`inline-block p-2 rounded-lg ${
          ownMessage ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {message}
      </span>
      <div className="text-xs text-gray-400 mt-1">{time}</div>
    </div>
  );
};

export default Message;
