# Simple DEX Platform

## Overview

The DEX Platform is a decentralized exchange (DEX) built using Ethereum smart contracts and the React framework. This application allows users to create liquidity pools, swap tokens, and check the pool information. The interface is built with Material-UI to provide a modern and responsive user experience.

## Features

- **Connect/Disconnect Wallet**: Users can connect their Ethereum wallet (e.g., MetaMask) to interact with the DEX.
- **Liquidity Pool Management**: Users can create new pools and add/remove liquidity.
- **Token Swapping**: Users can swap tokens within the platform seamlessly.
- **User Positions**: Users can view their positions and manage their investments effectively.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- An Ethereum wallet (like MetaMask) installed and configured.
- A local Ethereum test network (e.g., Ganache) or a testnet (e.g., Rinkeby, Goerli).

### Installation

1. Clone the repository:

```
git clone https://github.com/monmon-sitdown/dex-frontend.git
cd dex-frontend
```

2. Install the dependencies:

```
npm install
```

3. Start the application:

```
npm start
```

4. Open your browser and go to http://localhost:3000.

### Contract Deployment

Before using the DEX platform, ensure that the smart contract is deployed on the desired network. Update the `contractAddress` variable in the `App.js` file with your deployed contract address.

```
const contractAddress = "0x3D484E9E3f7c0ffcDE03315A5d6fc81C510b636F"; // Replace with your contract address
```

## Components

- **CreatePool**: Component for creating new liquidity pools.
- **SwapInterface**: Interface for swapping tokens between different pools.
- **LiquidityInterface**: Component for adding and managing liquidity.
- **RemoveLiquidityInterface**: Interface for removing liquidity from pools.
- **PoolInfo**: Displays information about the current liquidity pools.
- **UserPositions**: Shows the user's current positions and investments.

## Usage

1. **Connect Your Wallet**: Click the "Connect Wallet" button to connect your Ethereum wallet.
2. **Create a Pool**: Use the "Create Pool" component to create a new liquidity pool.
3. **Add Liquidity**: Add liquidity to your pools using the Liquidity Interface.
4. **Swap Tokens**: Use the Swap Interface to swap between different tokens.
5. **Manage User Positions**: View and manage your positions through the User Positions component.
