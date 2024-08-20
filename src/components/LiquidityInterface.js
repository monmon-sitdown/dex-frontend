// src/components/LiquidityInterface.js
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

function LiquidityInterface({ contract, onPoolCreated }) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
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

  // 获取当前未选择的代币列表
  const availableTokensForB = tokenList.filter(
    (token) => token.address !== tokenA
  );

  async function handleAddLiquidity() {
    if (!contract || !tokenA || !tokenB || !amountA || !amountB) {
      setError("Please fill all fields");
      return;
    }

    if (parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      setError("Amount 0 and Amount 1 must be greater than 0");
      return;
    }

    const poolExists = await checkIfPoolExists(tokenA, tokenB);
    if (!poolExists) {
      setError("This pool doesn't exist!");
      return;
    }

    try {
      // 确保代币顺序一致
      const sortedTokens = [tokenA, tokenB].sort();
      const [amountASorted, amountBSorted] = [amountA, amountB].map((amount) =>
        ethers.utils.parseEther(amount)
      );

      const tx = await contract.addLiquidity(
        sortedTokens[0],
        sortedTokens[1],
        amountASorted,
        amountBSorted
      );
      await tx.wait();
      console.log("Liquidity added successfully");
      onPoolCreated();
      setTokenA("");
      setTokenB("");
      setAmountA("");
      setAmountB("");
    } catch (error) {
      console.error("Failed to add liquidity:", error);
      setError("Failed to add liquidity");
    }
  }

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add Liquidity
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Token 0</InputLabel>
        <Select
          value={tokenA}
          onChange={(e) => {
            const selectedTokenA = e.target.value;
            setTokenA(selectedTokenA);
            // 重置 tokenB 为默认值，当 tokenA 更改时，tokenB 的选择应从未选择的代币中选择
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
      <TextField
        fullWidth
        label="Amount 0"
        type="number"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        margin="normal"
        error={parseFloat(amountA) <= 0 && amountA !== ""}
        helperText={
          parseFloat(amountA) <= 0 && amountA !== ""
            ? "Amount 0 must be greater than 0"
            : ""
        }
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Token 1</InputLabel>
        <Select
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          label="Token B"
          disabled={!tokenA} // tokenA 未选择时禁用 tokenB 下拉列表
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
        label="Amount 1"
        type="number"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        margin="normal"
        error={parseFloat(amountB) <= 0 && amountB !== ""}
        helperText={
          parseFloat(amountB) <= 0 && amountB !== ""
            ? "Amount 1 must be greater than 0"
            : ""
        }
      />
      <Button variant="contained" onClick={handleAddLiquidity} sx={{ mt: 2 }}>
        Add Liquidity
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

export default LiquidityInterface;
