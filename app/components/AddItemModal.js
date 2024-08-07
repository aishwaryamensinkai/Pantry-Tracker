import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageCapture from "./ImageCapture";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const unitsOfMeasurement = [
  "lbs (pounds)",
  "oz (ounces)",
  "kg (kilograms)",
  "g (grams)",
  "gal (gallons)",
  "qt (quarts)",
  "pt (pints)",
  "c (cups)",
  "fl oz (fluid ounces)",
  "ml (milliliters)",
  "l (liters)",
  "pcs (pieces)",
  "cans (cans)",
  "bottles (bottles)",
  "jars (jars)",
  "boxes (boxes)",
  "packs (packs)",
  "tbsp (tablespoons)",
  "tsp (teaspoons)",
  "bags (bags)",
  "slices (slices)",
  "bars (bars)",
];

const AddItemModal = ({
  open,
  handleClose,
  item,
  setItem,
  addItem,
  updateItem,
  editMode,
}) => {
  const [isImageCaptureOpen, setIsImageCaptureOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (typeof setItem === "function") {
      setItem((prevItem) => ({ ...prevItem, [name]: value }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (typeof setItem === "function") {
      setItem((prevItem) => ({ ...prevItem, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    if (typeof setItem === "function") {
      setItem((prevItem) => ({
        ...prevItem,
        expirationDate: date ? date.toISOString() : "",
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "category",
      "quantity",
      "unit",
      "expirationDate",
      "location",
    ];
    for (const field of requiredFields) {
      if (!item[field]) {
        toast.error(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const updatedItem = {
        ...item,
        notes: item.notes.trim() === "" ? "N/A" : item.notes,
        lastUpdated: new Date().toISOString(),
      };
      if (editMode) {
        updateItem(updatedItem);
      } else {
        addItem(updatedItem);
      }
      handleClose();
      toast.success(`Item ${editMode ? "updated" : "added"} successfully!`);
    }
  };

  const handleImageCaptured = (imageSrc) => {
    if (typeof setItem === "function") {
      setItem((prevItem) => ({
        ...prevItem,
        photo: imageSrc,
      }));
    }
    setIsImageCaptureOpen(false);
  };

  const expirationDate = item.expirationDate
    ? new Date(item.expirationDate)
    : null;
  const lastUpdatedDate = item.lastUpdated ? new Date(item.lastUpdated) : null;

  return (
    <>
      <div className={`modal ${open ? "open" : ""}`}>
        <div className="modal-content">
          <h2>{editMode ? "Edit Item" : "Add Item"}</h2>
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={item.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={item.category}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={item.quantity}
              onChange={handleInputChange}
              min="0"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit of Measurement</label>
            <select
              id="unit"
              name="unit"
              value={item.unit}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select a unit</option>
              {unitsOfMeasurement.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="expirationDate">Expiration Date</label>
            <DatePicker
              id="expirationDate"
              selected={expirationDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select expiration date"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={item.location}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={item.notes}
              onChange={handleInputChange}
              placeholder="Enter any notes (optional)"
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={() => setIsImageCaptureOpen(!isImageCaptureOpen)}
            >
              {isImageCaptureOpen ? "Close Image Capture" : "Capture Image"}
            </button>
            {isImageCaptureOpen && (
              <ImageCapture onImageCaptured={handleImageCaptured} />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="photo">Captured Photo</label>
            {item.photo && <img src={item.photo} alt="Captured" />}
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={handleSubmit}
              style={{ background: "#4CAF4F" }}
            >
              {editMode ? "Update Item" : "Add Item"}
            </button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
          {lastUpdatedDate && (
            <p className="last-updated">
              Last Updated: {lastUpdatedDate.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddItemModal;
