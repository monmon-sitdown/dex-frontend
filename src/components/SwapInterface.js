//src/components/SwapInterface.js
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

function SwapInterface({ contract, onSwaped }) {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [error, setError] = useState("");

  const checkIfPoolExists = async (tokenA, tokenB) => {
    try {
      // Ensure that tokenA is always less than tokenB for comparison
      if (tokenA > tokenB) {
        [tokenA, tokenB] = [tokenB, tokenA];
      }

      const poolPairs = await contract.getAllPoolPairs();
      for (const [pairTokenA, pairTokenB] of poolPairs) {
        if (
          (pairTokenA === tokenA && pairTokenB === tokenB) ||
          (pairTokenA === tokenB && pairTokenB === tokenA)
        ) {
          return true; // Pool exists
        }
      }
      return false; // Pool does not exist
    } catch (error) {
      console.error("Failed to check if pool exists:", error);
      return false;
    }
  };

  // Get the token list which was not chosen
  const availableTokensForB = tokenList.filter(
    (token) => token.address !== tokenIn
  );

  async function handleSwap() {
    if (parseFloat(amountIn) <= 0) {
      setError("Amount In must be greater than 0");
      return;
    }

    const poolExists = await checkIfPoolExists(tokenIn, tokenOut);
    if (!poolExists) {
      setError("This pool doesn't exist!");
      return;
    }

    console.log(tokenIn, tokenOut, amountIn, ethers.utils.parseEther(amountIn));

    try {
      const tx = await contract.swap(
        tokenIn,
        tokenOut,
        ethers.utils.parseEther(amountIn),
        { gasLimit: 500000 }
      );
      await tx.wait();
      console.log("Swap successful");
      onSwaped();
    } catch (error) {
      console.error("Swap failed:", error);
      if (error.data && error.data.message) {
        console.error("Error details:", error.data.message);
      } else {
        console.error("Unexpected error:", error.message);
      }

      setError("Swap failed. Please check the console for details.");
    }
  }

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Swap Tokens
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token In</InputLabel>
        <Select
          value={tokenIn}
          onChange={(e) => {
            const selectedTokenA = e.target.value;
            setTokenIn(selectedTokenA);
            // Reset tokenB to default. When tokenA changed, tokenB should be chosen in the unchosen list.
            if (tokenOut === selectedTokenA) {
              setTokenOut("");
            }
          }}
          label="Token A"
        >
          {tokenList.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              {token.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token Out</InputLabel>
        <Select
          value={tokenOut}
          onChange={(e) => setTokenOut(e.target.value)}
          label="Token Out"
          disabled={!tokenIn} // When tokenA is not determined, ban the drop menu of tokenB
        >
          {availableTokensForB.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              {token.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Amount In"
        type="number"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        margin="normal"
        error={parseFloat(amountIn) <= 0 && amountIn !== ""}
        helperText={
          parseFloat(amountIn) <= 0 && amountIn !== ""
            ? "Amount In must be greater than 0"
            : ""
        }
      />
      <Button variant="contained" onClick={handleSwap} sx={{ mt: 2 }}>
        Swap
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

export default SwapInterface;
