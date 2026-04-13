# Catalyst Finance

> **DeFi yields. Fiat simplicity. For Africa.**

Catalyst Finance is a mobile-first platform that bridges traditional finance and DeFi for users across Africa. Built on Starknet, it enables seamless crypto-to-fiat transactions and provides access to DeFi-native yields—all with complete wallet abstraction.

🔗 **Live Demo:** [catalyze.finance](https://catalyze.finance/)  
📝 **Devpost:** [Catalyst Finance Submission](https://devpost.com/software/catalyte-finance)

---

## 🎯 Problem Statement

Traditional crypto off-ramping in Africa is:
- **Slow**: 12+ hour withdrawal times on centralized exchanges
- **Expensive**: Up to 7% fees on ramping services
- **Complex**: Requires managing wallets, seed phrases, and gas fees
- **Inaccessible**: High barriers to entry for DeFi yield opportunities

## 💡 Solution

Catalyst Finance solves these problems by providing:

### 1. **Seamless Crypto-Fiat Transactions**
- **Fast**: Less than 1 minute transaction times
- **Affordable**: Simple 1% fee structure
- **Supported Assets**: USDC, USDT, STRK, WETH, WBTC
- **Local Currency**: Direct NGN (Nigerian Naira) integration

### 2. **Fiat Access to DeFi Yields**
- Deposit local currency and automatically earn DeFi-native yields
- Integration with Trove Finance for secure, audited yield strategies
- No need to understand blockchain complexity

### 3. **Complete Wallet Abstraction**
- No seed phrases to manage
- No gas fees for users
- Seamless onboarding via email/password
- Account abstraction powered by Chipi SDK

---

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4
- **State Management**: Jotai + Zustand
- **UI Components**: Material-UI, Lucide React
- **Animations**: Framer Motion, GSAP
- **Forms**: React Hook Form
- **Routing**: React Router DOM v7

### **Backend Stack**
- **Runtime**: Bun
- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **Queue System**: BullMQ + Redis (IORedis)
- **Authentication**: Better Auth
- **API Documentation**: Swagger/OpenAPI

### **Blockchain & Web3**
- **Network**: Starknet
- **Wallet SDK**: Chipi SDK (Account Abstraction)
- **Supported Tokens**: USDC, USDT, STRK, WETH, WBTC
- **DeFi Integration**: Trove Finance (Yield Strategies)

### **Payment Infrastructure**
- **Fiat Gateway**: Monnify (Nigerian payment rails)
- **Future Integration**: Yellowcard (multi-country expansion)

---

## 🔑 Key Features

### **For Users**
- ✅ Buy/sell crypto with local currency (NGN)
- ✅ Earn DeFi yields without blockchain knowledge
- ✅ Transfer crypto between wallets
- ✅ Real-time transaction tracking
- ✅ Multi-asset portfolio management
- ✅ Gasless transactions

### **Technical Highlights**
- ✅ **Liquidity Reservation System**: 30-minute liquidity holds for guaranteed transaction fulfillment
- ✅ **Dynamic Pricing**: Real-time price feeds with configurable spreads (buy: +15%, sell: -5%)
- ✅ **Trading Fees**: 1% on both buy and sell transactions
- ✅ **Webhook Integration**: Automated Monnify payment confirmations
- ✅ **Transaction PIN**: Secure withdrawal authorization
- ✅ **Balance Tracking**: Off-chain balance management for instant transfers

---

## 📁 Project Structure

```
catalyze/
├── backend/                 # Fastify backend
│   ├── src/
│   │   ├── config/         # Environment & constants
│   │   ├── db/             # Drizzle ORM schemas
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── crypto/     # Crypto deposits/withdrawals
│   │   │   ├── fiat/       # Fiat on/off-ramp
│   │   │   ├── staking/    # DeFi yield integration
│   │   │   ├── transactions/
│   │   │   └── users/
│   │   ├── utils/
│   │   │   ├── wallet/     # Chipi SDK integration
│   │   │   ├── troves/     # Trove Finance integration
│   │   │   └── queue/      # BullMQ workers
│   │   └── app.ts
│   └── package.json
├── src/                     # React frontend
│   ├── api/                # Axios API client
│   ├── components/         # Reusable components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   └── routes/             # Route definitions
├── public/
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x
- Bun (for backend)
- PostgreSQL
- Redis

### Installation

#### **Frontend**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

#### **Backend**
```bash
cd backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Configure your .env file with required credentials

# Run database migrations
bun run db:push

# Start development server
bun run dev

# Start production server
bun run start
```

### Environment Variables

**Backend** (`.env`):
```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# Monnify
MONNIFY_BASE_URL=https://api.monnify.com
MONNIFY_API_KEY=your_api_key
MONNIFY_SECRET_KEY=your_secret_key
MONNIFY_CONTRACT_CODE=your_contract_code
MONNIFY_WALLET_ACCOUNT_NUMBER=your_account_number

# Starknet
SYSTEM_WALLET_ADDRESS=0x...
SYSTEM_WALLET_PRIVATE_KEY=0x...

# Chipi SDK
CHIPI_API_KEY=your_chipi_key

# Other
MANUAL_WITHDRAWALS=false
DEPOSIT_CONFIRMATIONS=12
```

---

## 🎮 How It Works

### **Deposit Flow (Fiat → Crypto)**
1. User initiates deposit with NGN amount and token selection
2. System calculates token amount using real-time price + 1% fee
3. Liquidity is reserved for 30 minutes
4. Monnify generates payment instructions (bank transfer)
5. User completes payment via bank transfer
6. Webhook confirms payment
7. System transfers tokens from system wallet to user wallet
8. User balance is credited

### **Withdrawal Flow (Crypto → Fiat)**
1. User initiates withdrawal with NGN amount and bank details
2. System validates PIN token
3. Token amount calculated using real-time price - 1% fee
4. User's on-chain balance is validated
5. Tokens transferred from user wallet to system wallet
6. Monnify initiates bank disbursement
7. Fiat sent to user's bank account
8. Transaction marked as completed

### **DeFi Yield Integration**
1. User deposits fiat or crypto
2. Funds are automatically deployed to Trove Finance strategies
3. Supported strategies: Evergreen and Vesu Fusion
4. Real-time APY tracking (base APY + rewards APY)
5. Users earn yield without managing positions

---

## 🛠️ Technical Innovations

### **1. Liquidity Reservation System**
Prevents race conditions by reserving liquidity for 30 minutes during deposit intents. Ensures funds are available when payment is confirmed.

### **2. Account Abstraction**
Complete wallet abstraction using Chipi SDK. Users never see private keys, seed phrases, or pay gas fees.

### **3. Dual Balance System**
- **On-chain**: Actual blockchain balances
- **Off-chain**: Platform accounting for instant transfers and yield tracking

### **4. Dynamic Price Feeds**
Real-time pricing from CoinGecko with configurable spreads and fees:
- Buy price: Market price × (1 + spread) × (1 + fee)
- Sell price: Market price × (1 + spread) × (1 - fee)

### **5. Webhook-Driven Architecture**
Automated payment confirmations via Monnify webhooks with HMAC signature verification.

---

## 🎯 Roadmap

### **Phase 1: Beta Launch** (Current)
- [x] Core buy/sell functionality
- [x] Monnify integration
- [x] Wallet abstraction
- [x] Basic DeFi yield integration
- [ ] User testing and feedback

### **Phase 2: Expansion**
- [ ] Liquidity Provider (LP) program
- [ ] Multi-country support (Yellowcard integration)
- [ ] Bill payments (airtime, data, utilities)
- [ ] Enhanced yield strategies

### **Phase 3: Scale**
- [ ] Mobile native apps (iOS/Android)
- [ ] Additional DeFi protocols
- [ ] Stablecoin savings accounts
- [ ] P2P transfers

---

## 🏆 Hackathon Achievements

Built for the **Starknet Re{Solve} Hackathon**, Catalyst Finance demonstrates:
- ✅ End-to-end functional prototype
- ✅ Real-world problem solving for African markets
- ✅ Complex integration of blockchain and traditional finance
- ✅ User-first design with complete abstraction of blockchain complexity
- ✅ Scalable architecture ready for production

---

## 👥 Team

- **IkemHood Peter** - [GitHub](https://github.com/ikemhood)
- **Godstime Audu** - [GitHub](https://github.com/best2025j)
- **Raymond Joseph** - [GitHub](https://github.com/raymondjoseph02)
- **Ekuma Mathew** - [GitHub](https://github.com/ekumamatthew)
- **Ibrahim Ajibose** - [GitHub](https://github.com/Ajibose)

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

This is a hackathon project. For inquiries about collaboration or investment, please contact the team through Devpost.

---

## 📞 Support

For technical support or questions:
- Visit our [Devpost page](https://devpost.com/software/catalyte-finance)
- Check the [Starknet Re{Solve} Hackathon](https://resolve-starknet.devpost.com/)

---

**Built with ❤️ for Africa on Starknet**
