import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 }, // Increased width for better form layout
  bgcolor: "#f0f0f0", // Light background color
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  p: 4,
};

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

const locations = [
  "Top Shelf",
  "Middle Shelf",
  "Bottom Shelf",
  "Left Side",
  "Right Side",
  "Front",
  "Back",
  "Pantry Door",
  "Cabinet",
  "Drawer",
];

export default function AddItemModal({
  open,
  handleClose,
  item,
  setItem,
  addItem,
  editMode,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "category",
      "quantity",
      "unit",
      "expirationDate",
      "location",
      "notes",
    ];
    for (const field of requiredFields) {
      if (!item[field]) {
        enqueueSnackbar(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`,
          { variant: "error" }
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addItem(item);
      handleClose();
      enqueueSnackbar(`Item ${editMode ? "updated" : "added"} successfully!`, {
        variant: "success",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          textAlign="center"
          color="#333"
          fontWeight="bold"
          mb={2}
        >
          {editMode ? "Edit Item" : "Add Item"}
        </Typography>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="Item Name"
            variant="outlined"
            fullWidth
            value={item.name}
            onChange={handleInputChange}
            placeholder="Enter item name"
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={item.category}
              onChange={handleSelectChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="quantity"
            label="Quantity"
            variant="outlined"
            fullWidth
            value={item.quantity}
            onChange={handleInputChange}
            type="number"
            inputProps={{ min: 0 }}
            placeholder="Enter quantity"
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="unit-label">Unit of Measurement</InputLabel>
            <Select
              labelId="unit-label"
              name="unit"
              value={item.unit}
              onChange={handleSelectChange}
              label="Unit of Measurement"
            >
              <MenuItem value="lbs">lbs (pounds)</MenuItem>
              <MenuItem value="oz">oz (ounces)</MenuItem>
              <MenuItem value="kg">kg (kilograms)</MenuItem>
              <MenuItem value="g">g (grams)</MenuItem>
              <MenuItem value="gal">gal (gallons)</MenuItem>
              <MenuItem value="qt">qt (quarts)</MenuItem>
              <MenuItem value="pt">pt (pints)</MenuItem>
              <MenuItem value="c">c (cups)</MenuItem>
              <MenuItem value="fl oz">fl oz (fluid ounces)</MenuItem>
              <MenuItem value="ml">ml (milliliters)</MenuItem>
              <MenuItem value="l">l (liters)</MenuItem>
              <MenuItem value="pcs">pcs (pieces)</MenuItem>
              <MenuItem value="cans">cans (cans)</MenuItem>
              <MenuItem value="bottles">bottles (bottles)</MenuItem>
              <MenuItem value="jars">jars (jars)</MenuItem>
              <MenuItem value="boxes">boxes (boxes)</MenuItem>
              <MenuItem value="packs">packs (packs)</MenuItem>
              <MenuItem value="tbsp">tbsp (tablespoons)</MenuItem>
              <MenuItem value="tsp">tsp (teaspoons)</MenuItem>
              <MenuItem value="bags">bags (bags)</MenuItem>
              <MenuItem value="slices">slices (slices)</MenuItem>
              <MenuItem value="bars">bars (bars)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="expirationDate"
            label="Expiration Date"
            variant="outlined"
            fullWidth
            value={item.expirationDate}
            onChange={handleInputChange}
            placeholder="Enter expiration date"
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="location-label">Pantry Location</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={item.location}
              onChange={handleSelectChange}
              label="Pantry Location"
            >
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="notes"
            label="Notes"
            variant="outlined"
            fullWidth
            value={item.notes}
            onChange={handleInputChange}
            placeholder="Enter additional notes"
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ borderRadius: "8px", py: 1.5 }}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
