/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
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
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expirationDate: "",
    location: "",
    notes: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "inventory"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(items);
      } catch (error) {
        enqueueSnackbar("Error fetching inventory.", { variant: "error" });
      }
    };

    fetchInventory();
  }, [enqueueSnackbar]);

  const handleAddItem = async (item) => {
    try {
      await addDoc(collection(firestore, "inventory"), item);
      setInventory((prev) => [...prev, item]);
      enqueueSnackbar("Item added successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error adding item.", { variant: "error" });
    }
  };

  const handleRemoveItem = async (name) => {
    try {
      const itemToRemove = inventory.find((item) => item.name === name);
      if (itemToRemove) {
        await deleteDoc(doc(firestore, "inventory", itemToRemove.id));
        setInventory((prev) =>
          prev.filter((item) => item.id !== itemToRemove.id)
        ); // Use item.id for accuracy
        enqueueSnackbar("Item removed successfully!", { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar("Error removing item.", { variant: "error" });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md">
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
          onClick={() => {
            setEditMode(false);
            setCurrentItem({
              name: "",
              category: "",
              quantity: "",
              unit: "",
              expirationDate: "",
              location: "",
              notes: "",
            });
            setOpenModal(true);
          }}
        >
          Add New Item
        </Button>
      </Box>
      <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
      <InventoryList
        inventory={filteredInventory}
        removeItem={handleRemoveItem}
      />
      <AddItemModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        item={currentItem}
        setItem={setCurrentItem}
        addItem={handleAddItem}
        editMode={editMode}
      />
    </Container>
  );
}
