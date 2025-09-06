# 🌐 OmniRep ENS Integration

This document outlines how OmniRep integrates with the Ethereum Name Service (ENS) on Sepolia testnet to provide human-readable names for DIDs.

## Overview

OmniRep uses ENS to create persistent, human-readable identifiers that link to Decentralized Identifiers (DIDs). 
By using the ENS Name Wrapper on Sepolia, we create emancipated subnames under `omnirep.eth` that are fully 
controlled by the user, not by OmniRep.

## Technical Implementation

Our implementation follows the official ENS documentation for creating a subname registrar:
https://docs.ens.domains/wrapper/creating-subname-registrar

### Key Components

1. **ENS Registrar Contract Integration**
   - Uses the ENS Name Wrapper contract on Sepolia
   - Creates subnames with the `PARENT_CANNOT_CONTROL` fuse burned
   - Sets proper resolvers and records

2. **DID Resolution**
   - Stores DIDs as text records for ENS names
   - Provides reverse resolution from ENS to DID

3. **User Experience**
   - Automatic username generation based on wallet address
   - Persistence of ENS names across sessions using localStorage
   - Direct links to ENS profiles on Sepolia ENS App

## Code Structure

- `contracts/ensSubnameRegistrar.ts`: ENS registrar implementation using ethers.js
- `utils/ens-utils.ts`: React hooks and utilities for ENS integration
- `components/views/overview-view.tsx`: UI components for ENS management

## Usage Flow

1. User creates a DID in the OmniRep dashboard
2. User requests an ENS name
3. System generates a username or uses user input
4. System checks availability and creates the subname
5. System sets text records for DID resolution
6. User receives control of their emancipated subname

## Benefits

- **Decentralization**: Users own their ENS names, not OmniRep
- **Persistence**: Names remain valid as long as the parent domain is maintained
- **Interoperability**: Standard ENS integration works with the entire Ethereum ecosystem
- **Human-readable**: Easy to remember and share compared to DIDs or wallet addresses

## Testing

You can test the ENS integration on Sepolia testnet:
- ENS App: https://sepolia.app.ens.domains/
- Parent domain: `omnirep.eth`
