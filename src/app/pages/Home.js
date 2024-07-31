/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { firestore } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import SearchBar from "../components/SearchBar";
import AddItemModal from "../components/AddItemModal";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/globals.css";
import InventoryList from "../components/InventoryList";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expirationDate: "",
    location: "",
    notes: "",
  });
  const [search, setSearch] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const querySnapshot = await getDocs(snapshot);
    const items = querySnapshot.docs.map((doc) => doc.data());
    setInventory(items);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async (item) => {
    await setDoc(doc(firestore, "inventory", item.name), item);
    updateInventory();
  };

  const removeItem = async (name) => {
    await deleteDoc(doc(firestore, "inventory", name));
    updateInventory();
  };

  const handleSearch = () => {
    // Add your search logic here
    console.log("Searching for: ", search);
  };

  return (
    <Box className="home-container">
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <img src="../assets/images/logo.png" alt="Logo" className="logo" />
          <Typography variant="h6" className="app-title">
            Pantry Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack spacing={2} className="controls-section">
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Item
        </Button>
        <AddItemModal
          open={open}
          handleClose={handleClose}
          item={item}
          setItem={setItem}
          addItem={addItem}
          editMode={false}
        />
      </Stack>
      <InventoryList inventory={inventory} removeItem={removeItem} />
    </Box>
  );
}
