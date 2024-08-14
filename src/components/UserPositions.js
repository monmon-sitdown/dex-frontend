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

function UserPositions({ contract, account }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function fetchUserPositions() {
      if (contract && account) {
        try {
          const poolPairs = await contract.getAllPoolPairs();
          const userPositions = await Promise.all(
            poolPairs.map(async ([token0, token1]) => {
              const shares = await contract.getUserShare(
                account,
                token0,
                token1
              );
              return { token0, token1, shares };
            })
          );
          setPositions(
            userPositions.filter((position) => !position.shares.isZero())
          );
        } catch (error) {
          console.error("Failed to fetch user positions:", error);
        }
      }
    }
    fetchUserPositions();
  }, [contract, account]);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Your Liquidity Positions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token 0</TableCell>
              <TableCell>Token 1</TableCell>
              <TableCell>Shares</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position, index) => (
              <TableRow key={index}>
                <TableCell>{position.token0}</TableCell>
                <TableCell>{position.token1}</TableCell>
                <TableCell>
                  {ethers.utils.formatEther(position.shares)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserPositions;
