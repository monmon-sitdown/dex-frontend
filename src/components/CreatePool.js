import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";

function CreatePool({ contract }) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");

  const handleCreatePool = async () => {
    if (!contract || !tokenA || !tokenB) {
      console.error("Missing contract or token addresses.");
      return;
    }

    try {
      // 调用合约中的创建流动性池函数
      const tx = await contract.createPool(tokenA, tokenB);
      await tx.wait();
      console.log("Liquidity pool created successfully.");
    } catch (error) {
      console.error("Failed to create liquidity pool:", error);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create Liquidity Pool
      </Typography>
      <TextField
        label="Token A Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={tokenA}
        onChange={(e) => setTokenA(e.target.value)}
      />
      <TextField
        label="Token B Address"
        variant="outlined"
        fullWidth
        margin="normal"
        value={tokenB}
        onChange={(e) => setTokenB(e.target.value)}
      />
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
