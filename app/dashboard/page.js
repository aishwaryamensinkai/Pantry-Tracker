/* eslint-disable @next/next/no-img-element */
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
        <div
          className="p-8 rounded-lg shadow-lg bg-white text-center max-w-md mx-auto"
          style={{ marginTop: "85px" }}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome to the Pantry Tracker, {user ? user.displayName : "Guest"}!
          </h1>
          {user && (
            <div className="mb-4">
              <p className="text-lg text-gray-600">{user.email}</p>
            </div>
          )}
          <Pantry
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
