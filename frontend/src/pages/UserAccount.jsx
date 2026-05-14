import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import { Loading } from "../components/Loading";
import { UserData } from "../context/UserContext";
import Modal from "../components/Modal";
import { SocketData } from "../context/SocketContext";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";


const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();
  const params = useParams();

  const { posts, reels } = PostData();
  const { followUser } = UserData();
  const { onlineUsers = [] } = SocketData() || {}; // ✅ safe

  // ✅ ALL useState at top
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  async function fetchUser() {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/" + params.id);
      console.log("other user data:", data); 
      setUser(data.user);  
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); 
    }
  }

  async function followData(userId) {
    try {
      const { data } = await axios.get("/api/user/followdata/" + userId);
      setFollowersData(data.followers);
      setFollowingsData(data.following);
    } catch (error) {
      console.log(error);
    }
  }

  // ✅ ALL useEffects after ALL useState
  useEffect(() => {
    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (!user?._id) return;
    followData(user._id);
    if (user.followers && user.followers.includes(loggedInUser._id)) {
      setFollowed(true);
    }
  }, [user?._id]);

  const followHandler = () => {
    if (!user?._id) return; // ✅ guard against undefined
    setFollowed(!followed);
    followUser(user._id, fetchUser);
  };

  const prevReel = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const nextReel = () => {
    if (!myReels || index === myReels.length - 1) return;
    setIndex(index + 1);
  };

  let myPosts = posts ? posts.filter((p) => p.owner._id === user?._id) : [];
  let myReels = reels ? reels.filter((r) => r.owner._id === user?._id) : [];

  if (loading) return <Loading />;
  if (!user) return <p>User not found</p>;

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
        {show && (
          <Modal value={followersData} title={"Followers"} setShow={setShow} />
        )}
        {show1 && (
          <Modal
            value={followingsData}
            title={"Following"}
            setShow={setShow1}
          />
        )}
        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
          <div className="image flex flex-col justify-between mb-4 gap-4">
            <img
              src={user?.profilePic?.url || defaultAvatar} // ✅ safe
              alt=""
              className="w-[180px] h-[180px] rounded-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex justify-center items-center text-gray-800 font-semibold">
              {user.name}{" "}
              {onlineUsers.includes(user._id) && (
                <span className="ml-5 font-bold text-green-400">Online</span>
              )}
            </p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.gender}</p>
            <p
              className="text-gray-500 text-sm cursor-pointer"
              onClick={() => setShow(true)}
            >
              {followersData?.length || 0} followers // ✅
            </p>
            <p
              className="text-gray-500 text-sm cursor-pointer"
              onClick={() => setShow1(true)}
            >
              {followingsData?.length || 0} following // ✅
            </p>

            {user._id === loggedInUser._id ? (
              ""
            ) : (
              <button
                onClick={followHandler}
                className={`py-2 px-5 text-white rounded-md ${followed ? "bg-red-500" : "bg-blue-400"}`}
              >
                {followed ? "UnFollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
          <button onClick={() => setType("post")}>Posts</button>
          <button onClick={() => setType("reel")}>Reels</button>
        </div>

        {type === "post" && (
          <>
            {myPosts && myPosts.length > 0 ? (
              myPosts.map((e) => (
                <PostCard type={"post"} value={e} key={e._id} />
              ))
            ) : (
              <p>No Post Yet</p>
            )}
          </>
        )}

        {type === "reel" && (
          <>
            {myReels && myReels.length > 0 ? (
              <div className="flex gap-3 justify-center items-center">
                <PostCard
                  type={"reel"}
                  value={myReels[index]}
                  key={myReels[index]._id}
                />
                <div className="button flex flex-col justify-center items-center gap-6">
                  {index > 0 && (
                    <button
                      className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      onClick={prevReel}
                    >
                      <FaArrowUp />
                    </button>
                  )}
                  {index < myReels.length - 1 && (
                    <button
                      className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      onClick={nextReel}
                    >
                      <FaArrowDownLong />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p>No Reels Yet</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserAccount;
