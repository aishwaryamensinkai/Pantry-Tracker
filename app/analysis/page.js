"use client";
// app/analysis/page.js

import { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../firebase/config";
import Navbar from "../components/Navbar";
import InventoryAnalysis from "../components/InventoryAnalysis";
import { firestore } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

function AnalysisPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

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
      setItems(itemsData);
    } catch (error) {
      console.error("Failed to fetch items:", error.message);
    }
  }, [user]);

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

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  return (
    <div className="dashboard">
      <Navbar user={user} items={items} />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div style={{ marginTop: "85px", textAlign: "center" }}>
          <InventoryAnalysis items={items} />
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
