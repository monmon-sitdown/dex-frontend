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

  // 获取当前未选择的代币列表
  const availableTokensForB = tokenList.filter(
    (token) => token.address !== tokenA
  );

  async function handleAddLiquidity() {
    if (!contract || !tokenA || !tokenB || !amountA || !amountB) {
      setError("Please fill all fields");
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
        <InputLabel>Token A</InputLabel>
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
        label="Amount A"
        type="number"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Token B</InputLabel>
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
        label="Amount B"
        type="number"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
        margin="normal"
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
