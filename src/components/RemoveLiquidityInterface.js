//src/components/RemoveLiquidityInterface.js
import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import tokenList from "../tokenList";

function RemoveLiquidityInterface({ contract, onLiquidityRemoved }) {
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [shares, setShares] = useState("");
  const [error, setError] = useState("");

  // Get the token list which was not chosen
  const availableTokensForToken1 = tokenList.filter(
    (token) => token.address !== token0
  );

  async function handleRemoveLiquidity() {
    if (!contract || !token0 || !token1 || !shares) {
      setError("Please fill all fields");
      return;
    }

    try {
      // change to ether unit
      const sharesParsed = ethers.utils.parseEther(shares);

      // Call the contract to removeliquidity
      const tx = await contract.removeLiquidity(token0, token1, sharesParsed);
      await tx.wait();
      console.log("Liquidity removed successfully");
      onLiquidityRemoved();
      setToken0("");
      setToken1("");
      setShares("");
    } catch (error) {
      console.error("Failed to remove liquidity:", error);
      setError("Failed to remove liquidity");
    }
  }

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Remove Liquidity
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token 0</InputLabel>
        <Select
          value={token0}
          onChange={(e) => {
            const selectedToken0 = e.target.value;
            setToken0(selectedToken0);
            // Reset token1 to default. When tokenA changed, token0 should be chosen in the unchosen list.
            if (token1 === selectedToken0) {
              setToken1("");
            }
          }}
          label="Token 0"
        >
          {tokenList.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              {token.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token 1</InputLabel>
        <Select
          value={token1}
          onChange={(e) => setToken1(e.target.value)}
          label="Token 1"
          disabled={!token0} // When token0 is not determined, ban the drop menu of token1
        >
          {availableTokensForToken1.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              {token.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Shares"
        type="number"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        margin="normal"
        error={parseFloat(shares) <= 0 && shares !== ""}
        helperText={
          parseFloat(shares) <= 0 && shares !== ""
            ? "Shares must be greater than 0"
            : ""
        }
      />
      <Button
        variant="contained"
        onClick={handleRemoveLiquidity}
        sx={{ mt: 2 }}
      >
        Remove Liquidity
      </Button>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default RemoveLiquidityInterface;
