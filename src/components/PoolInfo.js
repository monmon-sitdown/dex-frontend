import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function PoolInfo({ contract }) {
  const [pools, setPools] = useState([]);

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
        } catch (error) {
          console.error("Failed to fetch pools:", error);
        }
      }
    }
    fetchPools();
  }, [contract]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Pool Information
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token 0</TableCell>
              <TableCell>Token 1</TableCell>
              <TableCell>Reserve 0</TableCell>
              <TableCell>Reserve 1</TableCell>
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
