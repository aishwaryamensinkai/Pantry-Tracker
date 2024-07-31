import { Box, Typography, Button, Stack, Divider } from "@mui/material";

export default function InventoryList({ inventory, removeItem }) {
  return (
    <Box className="inventory-list" sx={{ padding: 2 }}>
      <Box className="inventory-header" sx={{ marginBottom: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          Inventory Items
        </Typography>
      </Box>
      <Stack spacing={2}>
        {inventory.map((item) => (
          <Box
            key={item.name}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 1,
              padding: 2,
              backgroundColor: "#f9f9f9",
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
              <strong>Expiration Date:</strong> {item.expirationDate}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Location:</strong> {item.location}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              <strong>Notes:</strong> {item.notes}
            </Typography>
            <Divider sx={{ margin: "8px 0" }} />
            <Button
              variant="contained"
              color="error"
              onClick={() => removeItem(item.name)}
              sx={{ mt: 1 }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
