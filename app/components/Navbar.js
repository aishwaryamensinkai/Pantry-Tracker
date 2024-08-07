import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { app } from "../firebase/config";
import { firestore } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProfileModal from "./ProfileModal";
import { exportToPDF } from "../utils/exportPdf";

const Navbar = ({ user, items }) => {
  const router = useRouter();
  const auth = getAuth(app);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const q = query(
        collection(firestore, "inventory"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Update items state if necessary
    } catch (error) {
      console.error("Failed to fetch items:", error.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

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

  const toggleMenu = () => setShowMenu(!showMenu);

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
        <div
          className={`hamburger ${showMenu ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`nav-links ${showMenu ? "show" : ""}`}>
          {user ? (
            <>
              <a onClick={() => router.push("/dashboard")}>Dashboard</a>
              <a onClick={() => router.push("/analysis")}>Analysis</a>
              <a onClick={() => router.push("/generate-recipes")}>
                Generate Recipes
              </a>
              <button
                onClick={() => exportToPDF(items)}
                className="exportButton mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Export to PDF
              </button>
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
