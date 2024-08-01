// components/Notification.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Notification = ({ notification, markAsRead }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 1,
        padding: 2,
        backgroundColor: notification.read ? "#e0e0e0" : "#f9f9f9",
        marginBottom: 1,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {notification.type}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        <strong>Item:</strong> {notification.itemName}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        <strong>Date:</strong>{" "}
        {new Date(notification.date).toLocaleDateString()}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => markAsRead(notification.id)}
        sx={{ mt: 1 }}
      >
        Mark as Read
      </Button>
    </Box>
  );
};

export default Notification;
