import React from "react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="search-button"
        onClick={() => handleSearch(searchQuery)}
      >
        🔍
      </button>
    </div>
  );
}
