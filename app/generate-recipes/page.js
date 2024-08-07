"use client";

import { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../firebase/config";
import Navbar from "../components/Navbar";
import { firestore } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import RecipeSuggestions from "../components/RecipeSuggestions";

function GenerateRecipes() {
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
      <Navbar
        user={user}
        setShowNotifications={() => {}}
        setModalOpen={() => {}}
      />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div style={{ marginTop: "85px", textAlign: "center" }}>
          <h1 className="text-3xl font-bold mb-4">Recipe Suggestions</h1>
          <p className="text-lg mb-8">
            Click the button below to discover 3 delicious recipes that can be
            made using the items present in your pantry.
          </p>
          <br />
          <RecipeSuggestions pantryItems={items} />
        </div>
      </div>
    </div>
  );
}

export default GenerateRecipes;
