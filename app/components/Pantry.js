/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
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

  const filterItems = useCallback(
    (items) => {
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
    },
    [categoryFilter, expirationFilter, quantityFilter]
  );

  useEffect(() => {
    const filtered = filterItems(items);
    setFilteredItems(filtered);
  }, [items, filterItems]);

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
      setFilteredItems(itemsData);
      checkForAlerts(itemsData);
    } catch (error) {
      enqueueSnackbar("Failed to fetch items.", { variant: "error" });
    }
  }, [user, enqueueSnackbar]);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, fetchItems]);

  const checkForAlerts = useCallback((itemsData) => {
    const now = new Date();
    const alerts = itemsData.reduce((acc, item) => {
      if (item.expirationDate) {
        const expDate = new Date(item.expirationDate);
        const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
          acc.push({
            type: "expiring",
            message: `Item ${item.name} is expiring soon.`,
            date: expDate.toLocaleDateString(),
          });
        }
      }
      if (item.quantity < 5) {
        acc.push({
          type: "low",
          message: `Item ${item.name} is running low.`,
          count: item.quantity,
        });
      }
      return acc;
    }, []);
    setNotifications(alerts);
  }, []);

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
    if (!user?.uid) {
      console.error("User is not authenticated or user ID is missing.");
      enqueueSnackbar("User is not authenticated.", { variant: "error" });
      return;
    }

    try {
      await addDoc(collection(firestore, "inventory"), {
        ...item,
        userId: user.uid,
      });
      fetchItems();
      enqueueSnackbar("Item added successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error adding item:", error);
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
      console.error("Error updating item:", error);
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

  const handleClose = () => {
    setModalOpen(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="pantry-container">
      <div className="header">
        <button className="add-button" onClick={handleAddItemClick}>
          Add Item
        </button>
        <button className="notifications-button" onClick={toggleNotifications}>
          <div className="notifications-content">
            <NotificationsIcon />
            <span className="notification-count">{notifications.length}</span>
          </div>
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
        handleClose={handleClose}
        item={currentItem}
        setItem={setCurrentItem}
        addItem={addItem}
        updateItem={updateItem}
        editMode={editMode}
      />

      {showNotifications && (
        <div className="notifications-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            <button
              className="close-notifications"
              onClick={toggleNotifications}
            >
              <CloseIcon />
            </button>
          </div>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <span>{notification.message}</span>
                {notification.date && <span> - {notification.date}</span>}
                {notification.count && (
                  <span> - {notification.count} remaining</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Pantry;
