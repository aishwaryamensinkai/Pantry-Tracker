"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../firebase/config.js";
import Navbar from "../components/Navbar";
import Pantry from "../components/Pantry.js";

function Dashboard() {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  return (
    <div className="dashboard">
      <Navbar
        user={user}
        setShowNotifications={setShowNotifications}
        setModalOpen={setModalOpen}
      />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div style={{ marginTop: "85px", textAlign: "center" }}>
          <h1>Hi {user ? user.displayName : "Guest"}!</h1>
          <p>
            Manage your pantry items efficiently and never run out of your
            essential groceries. Get notified about low stock items, track your
            pantry inventory, and much more!
          </p>
        </div>
        <Pantry
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      </div>
    </div>
  );
}

export default Dashboard;
