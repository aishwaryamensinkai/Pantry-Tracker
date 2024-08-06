import React from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const InventoryList = ({ inventory, removeItem, editItem }) => {
  return (
    <div className="inventory-list">
      {inventory.length === 0 ? (
        <p className="empty-message">
          Your inventory is empty. Add some items to get started!
        </p>
      ) : (
        inventory.map((item) => (
          <div key={item.id} className="inventory-item">
            <div className="item-info">
              <h2 className="item-name">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </h2>
              <p className="item-detail">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="item-detail">
                <strong>Quantity:</strong> {item.quantity} {item.unit}
              </p>
              <p className="item-detail">
                <strong>Expiration Date:</strong>{" "}
                {item.expirationDate ? formatDate(item.expirationDate) : "N/A"}
              </p>
              <p className="item-detail">
                <strong>Location:</strong> {item.location}
              </p>
              <p className="item-detail">
                <strong>Notes:</strong> {item.notes}
              </p>
              <p className="item-detail">
                <strong>Last Updated:</strong>{" "}
                {item.lastUpdated ? formatDateTime(item.lastUpdated) : "N/A"}
              </p>
              <div className="item-actions">
                <button className="edit-btn" onClick={() => editItem(item)}>
                  Edit
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            {item.photo && (
              <div className="item-photo-container">
                <img src={item.photo} alt={item.name} className="item-photo" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InventoryList;
