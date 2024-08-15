import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CreatePool from "./components/CreatePool";
import SwapInterface from "./components/SwapInterface";
import LiquidityInterface from "./components/LiquidityInterface";
import PoolInfo from "./components/PoolInfo";
import UserPositions from "./components/UserPositions";
import DEXPlatformABI from "./DEXPlatform.abi.json";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [refreshPools, setRefreshPools] = useState(false); // Add this state

  useEffect(() => {
    if (provider && account) {
      const signer = provider.getSigner(account);
      const contractAddress = "0x090Bc3ff8116D285ad616aF3A9dF066B64b3126F";
      const dexContract = new ethers.Contract(
        contractAddress,
        DEXPlatformABI,
        signer
      );
      setContract(dexContract);
    }
  }, [provider, account]);

  useEffect(() => {
    if (contract) {
      // Whenever refreshPools changes, fetch pools
      setRefreshPools(false);
    }
  }, [refreshPools, contract]);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        setProvider(newProvider);
        setAccount(accounts[0]);
        setSnackbar({
          open: true,
          message: "Wallet connected",
          severity: "success",
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setSnackbar({
          open: true,
          message: "Failed to connect wallet",
          severity: "error",
        });
      }
    } else {
      console.error("No Ethereum provider found. Install Metamask.");
      setSnackbar({
        open: true,
        message: "No Ethereum provider found. Install Metamask.",
        severity: "warning",
      });
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setSnackbar({
      open: true,
      message: "Wallet disconnected",
      severity: "info",
    });
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePoolCreation = () => {
    setRefreshPools(true); // Trigger refresh
  };

  const handleAddLiquidity = () => {
    setRefreshPools(true); // Trigger refresh
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DEX Platform
          </Typography>
          {account ? (
            <Button color="inherit" onClick={disconnectWallet}>
              Disconnect Wallet
            </Button>
          ) : (
            <Button color="inherit" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {account && (
            <Typography variant="subtitle1">
              Connected Account: {account}
            </Typography>
          )}
          {account && contract ? (
            <>
              <PoolInfo contract={contract} refreshPools={refreshPools} />
              <CreatePool
                contract={contract}
                onPoolCreated={handlePoolCreation}
              />
              <LiquidityInterface
                contract={contract}
                onPoolCreated={handleAddLiquidity}
              />
              <SwapInterface contract={contract} />
              <UserPositions contract={contract} account={account} />
            </>
          ) : (
            <Typography variant="h5">
              Please connect your wallet to use the DEX platform.
            </Typography>
          )}
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
