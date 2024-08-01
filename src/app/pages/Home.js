/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Container, Box, Button, Typography } from "@mui/material";
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
    } catch (error) {
      enqueueSnackbar("Failed to fetch items.", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchItems();
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
    }, 300), // Debounce time in milliseconds
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItemClick}
            sx={{ mb: 2 }}
          >
            Add New Item
          </Button>
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
      </Box>
    </Container>
  );
}
