/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddItemModal from "./AddItemModal";
import InventoryList from "./InventoryList";
import { useSnackbar } from "notistack";
import { firestore } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import debounce from "lodash/debounce";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { getAuth } from "firebase/auth";

function Pantry({ user }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expirationDate: "",
    location: "",
    notes: "",
    lastUpdated: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expirationFilter, setExpirationFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const categories = [
    "Grains",
    "Canned Goods",
    "Dairy",
    "Produce",
    "Meat",
    "Frozen Foods",
    "Beverages",
    "Snacks",
    "Condiments",
    "Other",
  ];
  const filterItems = (items) => {
    return items.filter((item) => {
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;
      const matchesExpiration =
        !expirationFilter ||
        new Date(item.expirationDate) <= new Date(expirationFilter);
      const matchesQuantity =
        !quantityFilter || item.quantity >= Number(quantityFilter);

      return matchesCategory && matchesExpiration && matchesQuantity;
    });
  };

  useEffect(() => {
    const filtered = filterItems(items);
    setFilteredItems(filtered);
  }, [items, categoryFilter, expirationFilter, quantityFilter]);

  const fetchItems = async () => {
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
      setFilteredItems(itemsData);
      checkForAlerts(itemsData); // Check for low inventory or expiring items
    } catch (error) {
      enqueueSnackbar("Failed to fetch items.", { variant: "error" });
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const checkForAlerts = (itemsData) => {
    const now = new Date();
    const alerts = [];
    itemsData.forEach((item) => {
      if (item.expirationDate) {
        const expDate = new Date(item.expirationDate);
        const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          // Notify if expiring in 7 days or less
          alerts.push({
            type: "expiring",
            message: `Item ${item.name}.`,
            date: expDate.toLocaleDateString(),
          });
        }
      }
      if (item.quantity < 5) {
        // Notify if quantity is less than 5
        alerts.push({
          type: "low",
          message: `Item ${item.name} is running low.`,
          count: item.quantity,
        });
      }
    });
    setNotifications(alerts);
  };

  const handleSearch = useCallback(
    debounce((query) => {
      if (query) {
        const lowercasedQuery = query.toLowerCase();
        const filtered = items.filter(
          (item) =>
            item.name.toLowerCase().includes(lowercasedQuery) ||
            item.category.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems(items);
      }
    }, 300),
    [items]
  );

  const addItem = async (item) => {
    try {
      await addDoc(collection(firestore, "inventory"), {
        ...item,
        userId: user.uid,
      });
      fetchItems();
      enqueueSnackbar("Item added successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add item.", { variant: "error" });
    }
  };

  const updateItem = async (item) => {
    try {
      const itemRef = doc(firestore, "inventory", item.id);
      await updateDoc(itemRef, item);
      fetchItems();
      enqueueSnackbar("Item updated successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update item.", { variant: "error" });
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteDoc(doc(firestore, "inventory", id));
      fetchItems();
      enqueueSnackbar("Item deleted successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error deleting item:", error);
      enqueueSnackbar("Failed to delete item.", { variant: "error" });
    }
  };

  const handleAddItemClick = () => {
    setCurrentItem({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      expirationDate: "",
      location: "",
      notes: "",
      lastUpdated: "",
    });
    setEditMode(false);
    setModalOpen(true);
  };

  return (
    <div className="pantry-container">
      <div className="header">
        <button className="add-button" onClick={handleAddItemClick}>
          Add Item
        </button>
        <button
          className="notifications-button"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <span className="badge">{notifications.length}</span>
          <NotificationsIcon />
        </button>
      </div>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <button className="search-icon">
          <SearchIcon /> {/* Replace with the actual search icon component */}
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="expiration-filter">Filter by Expiration Date</label>
          <input
            id="expiration-filter"
            type="date"
            value={expirationFilter}
            onChange={(e) => setExpirationFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="quantity-filter">Filter by Minimum Quantity</label>
          <input
            id="quantity-filter"
            type="number"
            min="0"
            value={quantityFilter}
            onChange={(e) => setQuantityFilter(e.target.value)}
          />
        </div>
      </div>
      <InventoryList
        inventory={filteredItems}
        removeItem={handleDeleteClick}
        editItem={handleEditClick}
      />
      <AddItemModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        item={currentItem}
        addItem={addItem}
        updateItem={updateItem}
        editMode={editMode}
      />
      {showNotifications && (
        <div className="notifications-panel">
          <h3>Notifications</h3>
          {notifications.map((notification, index) => (
            <div key={index} className="notification">
              <span className="message">{notification.message}</span>
              {notification.type === "expiring" && (
                <span className="date">{notification.date}</span>
              )}
              {notification.type === "low" && (
                <span className="count">{notification.count}</span>
              )}
            </div>
          ))}
          <button
            className="close-notifications"
            onClick={() => setShowNotifications(false)}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default Pantry;
