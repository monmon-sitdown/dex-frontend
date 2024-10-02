// src/components/TokenPrice.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Typography } from "@mui/material";

function TokenPrice({ contract }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchPrice() {
      if (contract) {
        try {
          const price = await contract.getPrice(); // 假设合约有这个方法
          setPrice(ethers.utils.formatUnits(price, 18));
        } catch (error) {
          console.error("Failed to fetch price:", error);
        }
      }
    }
    fetchPrice();
  }, [contract]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Token Price
      </Typography>
      <Typography>
        {price ? `Current Price: ${price}` : "Under development..."}
      </Typography>
    </Box>
  );
}

export default TokenPrice;
