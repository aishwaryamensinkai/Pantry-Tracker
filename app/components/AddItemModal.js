import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function AddItemModal({
  open,
  handleClose,
  item,
  setItem,
  addItem,
  updateItem,
  editMode,
}) {
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

  const handleDateChange = (date) => {
    setItem((prevItem) => ({
      ...prevItem,
      expirationDate: date ? date.toISOString() : "",
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
    ];
    for (const field of requiredFields) {
      if (!item[field]) {
        alert(
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
      alert(`Item ${editMode ? "updated" : "added"} successfully!`);
    }
  };

  const expirationDate = item.expirationDate
    ? new Date(item.expirationDate)
    : null;

  const lastUpdatedDate = item.lastUpdated ? new Date(item.lastUpdated) : null;

  return (
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
              <option key={unit} value={unit.split(" ")[0]}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group date-picker-container">
          <label htmlFor="expirationDate">Expiration Date</label>
          <DatePicker
            selected={expirationDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select expiration date"
            customInput={<input id="expirationDate" />}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Pantry Location</label>
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
            placeholder="Enter additional notes"
            rows="4"
            cols="50"
          />
        </div>
        {lastUpdatedDate && (
          <p>Last Updated: {lastUpdatedDate.toLocaleString()}</p>
        )}
        <button className="submit-btn" onClick={handleSubmit}>
          {editMode ? "Update" : "Add"}
        </button>
        <button className="close-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
}
