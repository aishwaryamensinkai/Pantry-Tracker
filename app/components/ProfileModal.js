"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="profile-container">
          <img
            src={user.photoURL || "/assets/default-avatar.png"}
            alt="Profile"
            className="profile-image"
          />
          <h1 className="profile-name">{user.displayName || "User"}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
