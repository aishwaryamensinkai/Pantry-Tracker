/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "../firebase/config";

const Navbar = ({ user, setShowNotifications, setModalOpen }) => {
  const router = useRouter();
  const auth = getAuth(app);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <img src="../../assets/logo.png" alt="Logo" className="logo" />
      <div className="nav-links">
        {user ? (
          <>
            <img
              src={user.photoURL || "../../assets/default-avatar.png"}
              alt="Profile"
              className="user-avatar"
            />
            <button className="navButton" onClick={signOutUser}>
              Sign Out
            </button>
          </>
        ) : (
          <button className="signinButton" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
