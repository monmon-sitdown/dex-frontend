import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import tokenList from "../tokenList"; // import the list of token names

function CreatePool({ contract, onPoolCreated }) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [error, setError] = useState("");

  const checkIfPoolExists = async (tokenA, tokenB) => {
    try {
      // Ensure that address of tokenA is always less than tokenB for comparison
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
    (token) => token.address !== tokenA
  );

  const handleCreatePool = async () => {
    if (!contract || !tokenA || !tokenB) {
      console.error("Missing contract or token addresses.");
      return;
    }

    setError(""); // Clear previous errors

    const poolExists = await checkIfPoolExists(tokenA, tokenB);
    if (poolExists) {
      setError("This pool already exists.");
      return;
    }

    try {
      // Call the createPool function in the contract
      const tx = await contract.createPool(tokenA, tokenB);
      await tx.wait();
      console.log("Liquidity pool created successfully.");
      // Update PoolInfo data
      onPoolCreated();
    } catch (error) {
      console.error("Failed to create liquidity pool:", error);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create Liquidity Pool
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token A</InputLabel>
        <Select
          value={tokenA}
          onChange={(e) => {
            const selectedTokenA = e.target.value;
            setTokenA(selectedTokenA);
            // Reset tokenB to default. When tokenA changed, tokenB should be chosen in the unchosen list.
            if (tokenB === selectedTokenA) {
              setTokenB("");
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
        <InputLabel>Token B</InputLabel>
        <Select
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          label="Token B"
          disabled={!tokenA} // When tokenA is not determined, ban the drop menu of tokenB
        >
          {availableTokensForB.map((token) => (
            <MenuItem key={token.address} value={token.address}>
              {token.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePool}
        sx={{ mt: 2 }}
      >
        Create Pool
      </Button>
    </Box>
  );
}

export default CreatePool;
