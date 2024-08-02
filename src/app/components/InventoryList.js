import { Box, Typography, Button, Stack } from "@mui/material";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Adjust this to your preferred format if needed
};

export default function InventoryList({ inventory, removeItem, editItem }) {
  return (
    <Box className="inventory-list" sx={{ padding: 2 }}>
      <Stack spacing={2}>
        {inventory.map((item) => (
          <Box
            key={item.name}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 1,
              padding: 2,
              backgroundColor: "#f9f9f9",
              width: "96%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Category:</strong> {item.category}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Quantity:</strong> {item.quantity} {item.unit}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Expiration Date:</strong>{" "}
              {item.expirationDate ? formatDate(item.expirationDate) : "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Location:</strong> {item.location}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Notes:</strong> {item.notes}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Last Updated:</strong>{" "}
              {item.lastUpdated ? formatDateTime(item.lastUpdated) : "N/A"}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => editItem(item)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
        {inventory.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            No items in inventory.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
