// src/components/LiquidityInterface.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, TextField, Box, Typography } from "@mui/material";

function LiquidityInterface({ contract }) {
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  async function handleAddLiquidity() {
    try {
      const tx = await contract.addLiquidity(
        token0,
        token1,
        ethers.utils.parseEther(amount0),
        ethers.utils.parseEther(amount1)
      );
      await tx.wait();
      console.log("Liquidity added successfully");
    } catch (error) {
      console.error("Failed to add liquidity:", error);
    }
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add Liquidity
      </Typography>
      <TextField
        fullWidth
        label="Token 0 Address"
        value={token0}
        onChange={(e) => setToken0(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Token 1 Address"
        value={token1}
        onChange={(e) => setToken1(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Amount 0"
        type="number"
        value={amount0}
        onChange={(e) => setAmount0(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Amount 1"
        type="number"
        value={amount1}
        onChange={(e) => setAmount1(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleAddLiquidity} sx={{ mt: 2 }}>
        Add Liquidity
      </Button>
    </Box>
  );
}

export default LiquidityInterface;
