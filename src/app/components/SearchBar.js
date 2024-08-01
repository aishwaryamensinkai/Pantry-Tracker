import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) {
  return (
    <Box display="flex" alignItems="center" mb={3}>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search by name or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconButton
        color="primary"
        onClick={() => handleSearch(searchQuery)}
        sx={{ marginLeft: 1 }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}
