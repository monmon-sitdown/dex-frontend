import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        setProvider(newProvider);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("No Ethereum provider found. Install Metamask.");
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setProvider(null);
    setContract(null);
  }

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
              <CreatePool contract={contract} />
              <LiquidityInterface contract={contract} />
              <SwapInterface contract={contract} />
              <PoolInfo contract={contract} />
              <UserPositions contract={contract} account={account} />
            </>
          ) : (
            <Typography variant="h5">
              Please connect your wallet to use the DEX platform.
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
