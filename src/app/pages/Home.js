/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddItemModal from "../components/AddItemModal";
import InventoryList from "../components/InventoryList";
import SearchBar from "../components/SearchBar";
import { useSnackbar } from "notistack";
import { firestore } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import debounce from "lodash/debounce";
import CloseIcon from "@mui/icons-material/Close";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

export default function Home() {
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

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "inventory"));
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
    fetchItems();
  }, []);

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
      await addDoc(collection(firestore, "inventory"), item);
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
    <Container>
      <Box sx={{ my: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box display="flex" alignItems="center">
            <img
              src="../assets/images/logo.png"
              alt="Logo"
              style={{ width: "35%", marginRight: "10px" }}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItemClick}
              sx={{ mb: 2 }}
              startIcon={<AddCircleOutlineOutlined />} // Add the plus icon to the start of the button
            >
              Add
            </Button>
            <IconButton
              color="primary"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>
          </Box>
        </Box>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
            handleSearch(query);
          }}
          handleSearch={handleSearch}
        />
        <InventoryList
          inventory={filteredItems}
          removeItem={handleDeleteClick}
          editItem={handleEditClick}
        />
        <AddItemModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          item={currentItem}
          setItem={setCurrentItem}
          addItem={addItem}
          updateItem={updateItem}
          editMode={editMode}
        />
        {showNotifications && (
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "2%",
              width: "300px",
              bgcolor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              p: 2,
              zIndex: 1000,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6">Notifications</Typography>
              <IconButton
                color="inherit"
                onClick={() => setShowNotifications(false)}
                sx={{ p: 0 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {notifications.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No notifications.
              </Typography>
            ) : (
              notifications.map((notification, index) => (
                <Typography key={index} variant="body2" color="error" mb={1}>
                  {notification.message}
                  {notification.date && (
                    <Typography variant="body2" color="text.secondary">
                      {" "}
                      (Expiring on {notification.date})
                    </Typography>
                  )}
                  {notification.count !== undefined && (
                    <Typography variant="body2" color="text.secondary">
                      {" "}
                      (Only {notification.count} left)
                    </Typography>
                  )}
                </Typography>
              ))
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
