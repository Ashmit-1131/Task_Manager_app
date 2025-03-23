
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setUser } from '../features/auth/authSlice';
import './LoginPage.css'; 

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);


  useEffect(() => {
    if (user) {
      navigate('/tasks');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        dispatch(setUser({
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }));
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Task Manager</h1>
      <button className="login-button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
