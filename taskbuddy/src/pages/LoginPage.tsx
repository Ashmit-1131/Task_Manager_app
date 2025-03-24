import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/tasks");
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate("/tasks");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">TaskBuddy</h1>
      <button className="login-button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
