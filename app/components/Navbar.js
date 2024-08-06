"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "../firebase/config";
import ProfileModal from "./ProfileModal";

const Navbar = ({ user }) => {
  const router = useRouter();
  const auth = getAuth(app);
  const [showModal, setShowModal] = useState(false);

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
    <>
      <nav className="navbar">
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="logo"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />
        <div className="nav-links">
          <a onClick={() => router.push("/dashboard")}>Dashboard</a>
          <a onClick={() => router.push("/analysis")}>Analysis</a>
          {user ? (
            <>
              <img
                src={user.photoURL || "/assets/default-avatar.png"}
                alt="Profile"
                className="user-avatar"
                onClick={() => setShowModal(true)}
                style={{ cursor: "pointer" }}
              />
              <a onClick={signOutUser} className="signoutButton">
                Sign Out
              </a>
            </>
          ) : (
            <button onClick={signInWithGoogle} className="signinButton">
              Sign in with Google
            </button>
          )}
        </div>
      </nav>
      {showModal && (
        <ProfileModal user={user} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Navbar;
