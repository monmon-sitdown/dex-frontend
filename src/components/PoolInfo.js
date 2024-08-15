//src/components/PoolInfo.js
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function PoolInfo({ contract, refreshPools }) {
  const [pools, setPools] = useState([]);
  const tableRef = useRef(null); // 创建 ref 以引用表格

  useEffect(() => {
    async function fetchPools() {
      if (contract) {
        try {
          const poolPairs = await contract.getAllPoolPairs();
          const poolsInfo = await Promise.all(
            poolPairs.map(async ([token0, token1]) => {
              const [reserve0, reserve1, totalShares] =
                await contract.getPoolInfo(token0, token1);
              return { token0, token1, reserve0, reserve1, totalShares };
            })
          );
          setPools(poolsInfo);
          if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {
          console.error("Failed to fetch pools:", error);
        }
      }
    }
    fetchPools();
  }, [contract, refreshPools]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Pool Information
      </Typography>
      <TableContainer component={Paper}>
        <Table ref={tableRef}>
          <TableHead>
            <TableRow>
              <TableCell>Token A</TableCell>
              <TableCell>Token B</TableCell>
              <TableCell>Reserve A</TableCell>
              <TableCell>Reserve B</TableCell>
              <TableCell>Total Shares</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((pool, index) => (
              <TableRow key={index}>
                <TableCell>{pool.token0}</TableCell>
                <TableCell>{pool.token1}</TableCell>
                <TableCell>{ethers.utils.formatEther(pool.reserve0)}</TableCell>
                <TableCell>{ethers.utils.formatEther(pool.reserve1)}</TableCell>
                <TableCell>
                  {ethers.utils.formatEther(pool.totalShares)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PoolInfo;
