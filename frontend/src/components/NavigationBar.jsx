import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircle } from "react-icons/io5";
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";
import { ChatData } from "../context/ChatContext"; 

const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname);
  const { unreadCount } = ChatData();
  return (
    <div className="fixed bottom-0 w-full bg-white py-3">
      <div className="flex justify-around">
        <Link
          to={"/"}
          onClick={() => setTab("/")}
          className="flex flex-col items-center text-2xl"
        >
          <span>{tab === "/" ? <AiFillHome /> : <AiOutlineHome />}</span>
        </Link>
        <Link
          to={"/reels"}
          onClick={() => setTab("/reels")}
          className="flex flex-col items-center text-2xl"
        >
          <span>
            {tab === "/reels" ? <BsCameraReelsFill /> : <BsCameraReels />}
          </span>
        </Link>
        <Link
          onClick={() => setTab("/search")}
          to={"/search"}
          className="flex flex-col items-center text-2xl"
        >
          <span>
            {tab === "/search" ? <IoSearchCircle /> : <IoSearchCircleOutline />}
          </span>
        </Link>
        <Link
          onClick={() => {
            setTab("/chat");
            setUnreadCount(0);
          }}
          to={"/chat"}
          className="flex flex-col items-center text-2xl"
        >
          <span className="relative">
            {" "}
            {/* 👈 change span to relative */}
            {tab === "/chat" ? (
              <IoChatbubbleEllipses />
            ) : (
              <IoChatbubbleEllipsesOutline />
            )}
            {/* 👈 add this badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
        </Link>
        <Link
          onClick={() => setTab("/account")}
          to={"/account"}
          className="flex flex-col items-center text-2xl"
        >
          <span>
            {tab === "/account" ? (
              <RiAccountCircleFill />
            ) : (
              <RiAccountCircleLine />
            )}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;