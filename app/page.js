/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "./firebase/config";
import Navbar from "./components/Navbar";

const Home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        router.push("/dashboard");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="home">
      <Navbar user={user} />
      <main className="main">
        <div className="hero">
          <div className="content">
            <h1 className="title">Welcome to Pantry Tracker!</h1>
            <p className="subtitle">
              Your personal inventory management solution.
            </p>
            <p className="description">
              Track and manage your pantry items with ease. Our app offers a
              comprehensive suite of features designed to simplify your
              inventory management. Whether you're organizing your kitchen or
              managing a larger pantry, we've got you covered.
            </p>
            <div className="features">
              <div className="feature">
                <h2 className="featureTitle">Easy Inventory Tracking</h2>
                <p className="featureDescription">
                  Keep track of all your pantry items with ease. Our app allows
                  you to add, remove, and update items quickly.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">Smart Notifications</h2>
                <p className="featureDescription">
                  Get notified when items are running low or when it's time to
                  restock. Stay on top of your inventory with smart alerts.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">User-Friendly Interface</h2>
                <p className="featureDescription">
                  Our intuitive interface makes managing your pantry simple and
                  enjoyable. No more complicated processes – just
                  straightforward functionality.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">Export PDF</h2>
                <p className="featureDescription">
                  Effortlessly manage and keep track of your pantry items by
                  generating and exporting your pantry list as a PDF, ensuring
                  you have easy access to your inventory anywhere, anytime.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">Data Analysis</h2>
                <p className="featureDescription">
                  Analyze your pantry data with comprehensive charts and graphs.
                  Visualize your inventory trends with pie charts and bar graphs
                  to make informed decisions about restocking and usage
                  patterns.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">Recipe Suggestions</h2>
                <p className="featureDescription">
                  Explore mouthwatering recipes crafted from the items already
                  in your pantry. SignUp to discover three incredible recipes
                  customized just for you.
                </p>
              </div>
              <div className="feature">
                <h2 className="featureTitle">View User Profile</h2>
                <p className="featureDescription">
                  Access and update your user profile to personalize your pantry
                  management experience. Keep your information up-to-date for a
                  more tailored experience.
                </p>
              </div>
            </div>
            <p className="description">
              Ready to get started? Sign in with your Google account to access
              your personalized dashboard and begin managing your pantry
              effectively.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
