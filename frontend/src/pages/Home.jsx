import React from "react";
import AddPost from "../components/AddPost.jsx";
import PostCard from "../components/PostCard.jsx";
import { PostData } from "../context/PostContext.jsx";
import { Loading } from "../components/Loading.jsx";

const Home = () => {
  const { posts, loading } = PostData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <AddPost type="post" />
          {posts && posts.length > 0 ? (
            posts.map((e) => <PostCard value={e} key={e._id} type={"post"} />)
          ) : (
            <p>No Post Yet</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
