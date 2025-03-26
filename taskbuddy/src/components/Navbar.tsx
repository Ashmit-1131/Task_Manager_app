// src/components/Navbar.tsx
import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">TaskBuddy</div>
      <div className="navbar-profile">
        {user ? (
          <>
            <img
              src={user.photoURL || "/default-profile.png"}
              alt="User Profile"
              className="profile-pic"
            />
            <span className="profile-name">{user.displayName}</span>
          </>
        ) : (
          <span className="profile-name">Guest</span>
        )}
        <button className="navbar-signout" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
