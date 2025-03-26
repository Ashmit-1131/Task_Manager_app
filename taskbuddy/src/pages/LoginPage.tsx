import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setUser } from "../features/auth/authSlice";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // If a user exists (from Redux or Firebase), navigate to tasks page.
    if (user || auth.currentUser) {
      if (!user && auth.currentUser) {
        dispatch(setUser(auth.currentUser));
      }
      navigate("/tasks");
    }
  }, [user, navigate, dispatch]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        dispatch(setUser(result.user));
        navigate("/tasks");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome to TaskBuddy</h1>
        <p className="login-subtitle">Your personal task management app.</p>
        <button className="login-button" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
