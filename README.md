# 🌟 OmniRep - Universal Reputation Protocol

## ETHAccra Hackathon 2025 Submission ⚡

**Project Name:** OmniRep  
**Track:** 🌐 Ethereum for Everyone: Scaling Infrastructure Meets Real-World UX  
**Bounties:** ENS Everywhere, Buidl Guidl, Base  

---

## 📌 Short Description (280 Characters)

OmniRep is a decentralized reputation protocol that aggregates cross-platform activity into verifiable on-chain credentials, enabling users to build portable digital identity across Web3 ecosystems using ENS, DIDs, and real-time data analytics.

---

## 🎯 Problem Statement

In Africa's rapidly growing digital economy, developers, creators, and entrepreneurs struggle with:
- **Fragmented Digital Identity**: Reputation scattered across GitHub, social platforms, and on-chain activity
- **Limited Access to Opportunities**: No unified way to showcase credibility for grants, jobs, or collaborations
- **Trust Barriers**: Difficulty verifying skills and contributions in decentralized communities
- **Poor Web3 UX**: Complex wallet interactions and identity management for newcomers

---

## 💡 Solution: Universal Reputation Protocol

OmniRep creates a **unified, verifiable digital reputation system** that:

1. **Aggregates Multi-Platform Data**: Real-time integration with GitHub, wallet analytics, and social platforms
2. **Generates Verifiable Credentials**: IPFS-stored, cryptographically signed reputation proofs
3. **ENS-Powered Identity**: Human-readable names like `alice.omnirep.eth` for seamless UX
4. **Real-World Applications**: Grant eligibility, job verification, and community trust scoring

---

## 🛠 How It's Made (Technical Breakdown)

### Architecture Overview
```
Frontend (Next.js) → Reputation Engine → External APIs → Blockchain
     ↓                    ↓                ↓              ↓
  Dashboard UI      Data Aggregation   GitHub/APIs    ENS + IPFS
```

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Recharts
- **Blockchain**: Ethereum, Base, ENS (Sepolia testnet)
- **Identity**: Decentralized Identifiers (DIDs), Verifiable Credentials
- **Storage**: IPFS for credential storage
- **APIs**: GitHub API, Alchemy, Etherscan for real-time data
- **Wallet**: RainbowKit, Wagmi for seamless Web3 integration

### Key Components

#### 1. **Reputation Engine** (`services/reputation.ts`)
- Weighted scoring algorithm (30% wallet, 25% GitHub, 15% social, etc.)
- Real-time data aggregation from multiple sources
- Standardized scoring across platforms

#### 2. **Wallet Analytics Service** (`services/wallet-analytics.ts`)
- On-chain transaction analysis
- DeFi protocol interaction tracking
- NFT ownership and ENS name resolution
- Fallback mechanisms for API limitations

#### 3. **GitHub Integration** (`services/github.ts`)
- Repository metrics and contribution analysis
- Language proficiency scoring
- Account age and activity patterns
- Cached data with refresh mechanisms

#### 4. **ENS Integration** (`utils/ens-utils.ts`)
- Subdomain creation (`user.omnirep.eth`)
- Profile linkage with DID and reputation data
- Human-readable identity resolution

#### 5. **Verifiable Credentials**
- W3C standard compliance
- IPFS storage with content addressing
- Cryptographic integrity verification
- Portable across platforms

### Team Contributions
**Solo Developer**: Full-stack development, smart contract integration, UX/UI design, and API integrations

### Creative Solutions
- **Fallback Data Sources**: Multiple API layers ensure reliability even with rate limits
- **Progressive Enhancement**: Works with basic wallet connection, enhanced with platform connections
- **Real-Time Updates**: 30-minute cache refresh for dynamic reputation scoring
- **Mobile-First Design**: Optimized for African mobile-first user base

---

## 🔗 Public Code & Design Links

### 📂 **GitHub Repository**
**Main Repo**: [https://github.com/Kwasi633/omni-rep](https://github.com/Kwasi633/omni-rep)

### 🚀 **Live Demo**
**Deployed App**: [Coming Soon - Base/Sepolia Deployment]

### 📋 **Architecture Docs**
- Component architecture documented in `/docs`
- API integration guides in service files
- Setup instructions in package-specific READMEs

---

## 🎬 Demo Video & Presentation

### 📹 **Demo Video** (3 minutes)
**Link**: [Demo Video URL - To be added]

**Content Overview**:
1. **Problem Introduction** (30s): African Web3 identity challenges
2. **Platform Walkthrough** (90s): Live demo of reputation calculation
3. **ENS Integration** (30s): Creating `user.omnirep.eth` identity
4. **Verifiable Credentials** (30s): IPFS storage and verification

### 📊 **Presentation Slides**
**Link**: [Presentation Slides - To be added]

**10 Slides Overview**:
1. Problem Statement
2. Solution Architecture
3. Technical Implementation
4. ENS Integration Demo
5. Real Data Sources
6. Verifiable Credentials
7. Impact for Africa
8. Future Roadmap
9. Business Model
10. Thank You & Q&A

---

## 🌐 Deployment & Contract Details

### 🔗 **Live Application**
- **Frontend**: Deployed on Vercel
- **Network**: Base Sepolia Testnet
- **ENS**: Sepolia testnet integration

### 📜 **Smart Contract Addresses**
*Note: Using ENS registry and IPFS for decentralized storage*

- **ENS Registry**: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e` (Sepolia)
- **IPFS Gateway**: `https://ipfs.io/ipfs/`

### 🔧 **Setup Instructions**
```bash
# Clone the repository
git clone https://github.com/Kwasi633/omni-rep.git
cd omni-rep

# Install dependencies
yarn install

# Set up environment variables
cp packages/nextjs/.env.example packages/nextjs/.env.local
# Add your API keys for enhanced features

# Start development server
yarn start

# Access at http://localhost:3000
```

---

## 🌍 Problem, Impact & Future Roadmap

### 🎯 **Real-World Impact**

#### For African Developers:
- **Grant Access**: Verifiable reputation for funding applications
- **Remote Work**: Trusted profiles for global opportunities
- **Community Building**: Reputation-based DAO participation

#### For Organizations:
- **Talent Discovery**: Merit-based hiring with verified skills
- **Grant Distribution**: Automated eligibility verification
- **Trust Networks**: Community-driven reputation systems

### 📈 **Scaling Vision**

#### Phase 1: Foundation (Current)
- ✅ Multi-platform data aggregation
- ✅ ENS integration
- ✅ Verifiable credentials
- ✅ Real-time reputation scoring

#### Phase 2: Expansion (Q2 2025)
- 🔄 Mobile app for broader accessibility
- 🔄 Integration with job platforms
- 🔄 DAO governance for reputation standards
- 🔄 Grant marketplace with auto-matching

#### Phase 3: Ecosystem (Q4 2025)
- 🔄 Cross-chain reputation portability
- 🔄 AI-powered skill verification
- 🔄 Reputation-based lending protocols
- 🔄 Community moderation systems

---

## 🏆 Bounty Participation & Technical Implementation

### 🎯 **ENS Everywhere Bounty - $4,800 Prize Pool**

#### **How We're Using ENS:**

**1. Identity & Reputation Integration**
- **Location**: `utils/ens-utils.ts` - ENS subdomain creation and management
- **Implementation**: Users can create `username.omnirep.eth` subdomains directly from the platform
- **Reputation Linkage**: ENS names are automatically linked to DID and reputation scores

```typescript
// ENS Subdomain Creation with Reputation Data
await createUserSubname(walletAddress, did, username);
// Automatically links DID and reputation data to ENS profile
```

**2. Human-readable Identity**
- **Address Resolution**: Replace `0x742d35...` with `alice.omnirep.eth` in all UI components
- **Profile Display**: ENS names shown in reputation cards and user profiles
- **Reverse Resolution**: Automatic ENS name lookup for connected wallets

**3. Cross-platform Profile Linking**
- **GitHub Integration**: ENS profiles linked to verified GitHub accounts
- **Reputation Display**: ENS names associated with calculated reputation scores
- **Identity Verification**: ENS as the primary identity layer for the platform

#### **Code Locations:**
- **ENS Integration**: `utils/ens-utils.ts` (Complete ENS utilities)
- **UI Components**: `components/views/overview-view.tsx` (ENS creation flow)
- **Profile Display**: `components/views/reputation-view.tsx` (ENS name resolution)

#### **Implemented Features:**
- ✅ One-click ENS subdomain creation
- ✅ ENS name display throughout the application
- ✅ Human-readable identity in all interfaces
- ✅ DID linkage with ENS profiles

---

### 🚀 **Buidl Guidl Bounty - $1,000 Prize Pool**

#### **How We're Using Scaffold-ETH 2:**

**1. Complete dApp Foundation**
- **Built On**: Entire project uses Scaffold-ETH 2 as the foundation
- **Framework**: Next.js 14, TypeScript, TailwindCSS from Scaffold-ETH template
- **Wallet Integration**: RainbowKit for seamless multi-wallet support
- **Development Environment**: Hardhat configuration ready for smart contracts

**2. Custom Extensions Built**
- **Identity Hooks**: `hooks/useIdentity.ts` for DID generation and management
- **Credential Hooks**: `hooks/useCredential.ts` for verifiable credential creation
- **ENS Hooks**: `hooks/useENSIntegration.ts` for ENS subdomain management
- **Reputation Engine**: Complete reputation calculation system

**3. Web3 Best Practices**
- **TypeScript**: Full type safety across the entire application
- **Wagmi Integration**: React hooks for Ethereum interactions
- **Component Architecture**: Reusable Web3 components for identity management

#### **Code Locations:**
- **Scaffold Foundation**: Root project structure following Scaffold-ETH 2 patterns
- **Custom Hooks**: `hooks/useIdentity.ts`, `hooks/useCredential.ts`, `hooks/useENSIntegration.ts`
- **Services**: `services/reputation.ts`, `services/github.ts`, `services/wallet-analytics.ts`
- **Components**: Extended scaffold components with reputation features

#### **Scaffold-ETH Extensions Created:**
- ✅ DID generation and management system
- ✅ IPFS credential upload utilities
- ✅ ENS integration components
- ✅ Real-time reputation calculation engine
- ✅ Multi-platform data aggregation services

---

## 🔧 Implemented Bounty Summary

| Bounty | Integration Status | Key Implemented Features | Code Evidence |
|--------|-------------------|---------------------------|---------------|
| **ENS Everywhere** | 🟢 **Fully Implemented** | Subdomains, identity linking, UI integration | `utils/ens-utils.ts` |
| **Buidl Guidl** | 🟢 **Foundation + Extensions** | Scaffold-ETH 2 base + custom hooks & services | Entire project structure |

**Note**: Only including bounties with complete implementations. Additional bounties may be added as features are completed during the hackathon.

---

### 🌐 **Ethereum for Everyone Track**
- **Scaling Infrastructure**: Real-time data processing with efficient caching
- **Real-World UX**: One-click ENS identity creation, progressive wallet onboarding
- **Everyday Use**: Reputation for job applications, grant access, community participation

### 🎯 **ENS Everywhere Bounty**
- **Identity & Reputation**: Portable digital identity with verifiable credentials
- **Cross-border Coordination**: Named addresses for DAO participation
- **Creative Integration**: Subname creation with reputation linkage

### 🚀 **Buidl Guidl Bounty**
- **Built with Scaffold-ETH**: Modern dApp framework with TypeScript
- **Impactful dApp**: Solving real identity challenges in Web3
- **Community Value**: Open-source tools for reputation building

---

## 🚀 Getting Started

### Quick Demo
1. **Connect Wallet**: Use any Ethereum wallet (MetaMask, Rainbow, etc.)
2. **Generate Reputation**: Automatic scoring from on-chain activity
3. **Connect GitHub**: Boost technical reputation with code contributions
4. **Create ENS Identity**: Get your `username.omnirep.eth` name
5. **Issue Credential**: Generate verifiable proof of reputation

### Development Setup
```bash
# Prerequisites
node.js 18+, yarn, git

# Clone and install
git clone https://github.com/Kwasi633/omni-rep.git
cd omni-rep && yarn install

# Environment setup
cp packages/nextjs/.env.example packages/nextjs/.env.local

# Start development
yarn start
```

---

## 🤝 Community & Support

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: [Community Discord - To be added]
- **Twitter**: [@OmniRepProtocol](https://twitter.com/OmniRepProtocol)
- **Demo Day**: ETHAccra 2025 Presentation

---

## 📄 License

MIT License - Open source for community building

---

## 🙏 Acknowledgments

- **ETHAccra 2025** for the amazing hackathon opportunity
- **ENS Team** for the powerful naming infrastructure
- **Buidl Guidl** for the excellent developer tools
- **Base Team** for the scalable L2 solution
- **African Web3 Community** for inspiration and feedback

---

## 📹 Video Demo  

[Watch the Demo](https://drive.google.com/file/d/1pu4c3WApbc37Rc70H0DANFxFC74zM5ob/view?usp=sharing)


**Built with ❤️ for Africa's Web3 Future**