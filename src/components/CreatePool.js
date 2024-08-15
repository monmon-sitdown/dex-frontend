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
import tokenList from "../tokenList"; // 引入代币列表

function CreatePool({ contract, onPoolCreated }) {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
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
      // 调用合约中的创建流动性池函数
      const tx = await contract.createPool(tokenA, tokenB);
      await tx.wait();
      console.log("Liquidity pool created successfully.");
      // 刷新 PoolInfo 数据
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
