import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, TextField, Box, Typography } from "@mui/material";

function SwapInterface({ contract }) {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");

  async function handleSwap() {
    try {
      const tx = await contract.swap(
        tokenIn,
        tokenOut,
        ethers.utils.parseEther(amountIn)
      );
      await tx.wait();
      console.log("Swap successful");
    } catch (error) {
      console.error("Swap failed:", error);
    }
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Swap Tokens
      </Typography>
      <TextField
        fullWidth
        label="Token In Address"
        value={tokenIn}
        onChange={(e) => setTokenIn(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Token Out Address"
        value={tokenOut}
        onChange={(e) => setTokenOut(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Amount In"
        type="number"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleSwap} sx={{ mt: 2 }}>
        Swap
      </Button>
    </Box>
  );
}

export default SwapInterface;
