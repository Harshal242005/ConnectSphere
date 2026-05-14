

import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext({
  user: null,
  isAuth: false,
  loading: true,
  loginUser: () => {},
  logoutUser: () => {},
  registerUser: () => {},
  followUser: () => {},
  updateProfilePic: () => {},
  updateProfileName: () => {},
  setUser: () => {},
  setIsAuth: () => {},
});



export const UserContextProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    isAuth: false,
    loading: true,
  });

  useEffect(() => {
    console.log("loading state changed to:", state.loading);
  }, [state.loading]);
  

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      console.log("fetchUser success", data);
      setState({ user: data.user, isAuth: true, loading: false }); // ✅ data.user not data
    } catch (error) {
      setState({ user: null, isAuth: false, loading: false });
    }
  }

  async function loginUser(email, password, navigate, fetchPosts) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      toast.success(data.message);
      setState({ user: data.user, isAuth: true, loading: false });
      navigate("/");
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      setState((prev) => ({ ...prev, loading: false }));
    }
  }

  async function registerUser(formdata, navigate, fetchPosts) {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data } = await axios.post("/api/auth/register", formdata);
      toast.success(data.message);
      setState({ user: data.user, isAuth: true, loading: false });
      navigate("/");
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Register failed");
      setState((prev) => ({ ...prev, loading: false }));
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.get("/api/auth/logout");
      toast.success(data.message);
      setState({ user: null, isAuth: false, loading: false });
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  }

  async function followUser(id, refetch) {
    try {
      const { data } = await axios.post("/api/user/follow/" + id);
      toast.success(data.message);
      refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  }

  async function updateProfilePic(id, formdata, setFile) {
    try {
      const { data } = await axios.put("/api/user/" + id, formdata);
      toast.success(data.message);
      fetchUser();
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  }

  async function updateProfileName(id, name, setShowInput) {
    try {
      const { data } = await axios.put("/api/user/" + id, { name });
      toast.success(data.message);
      fetchUser();
      setShowInput(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: state.user, // ✅ explicit, not spread
        isAuth: state.isAuth, // ✅ explicit
        loading: state.loading,
        setUser: (user) => setState((prev) => ({ ...prev, user })),
        setIsAuth: (isAuth) => setState((prev) => ({ ...prev, isAuth })),
        loginUser,
        logoutUser,
        registerUser,
        followUser,
        updateProfilePic,
        updateProfileName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);