# AICerts — Solana-Based Credential Issuance Platform

## FrontEnd ( React + TypeScript)

- Init :: npm create vite@latest frontend

- Live website :: https://frontend-aicerts-solana-project.vercel.app/

- To run locally ::

```
  cd frontend
  npm install
  npm run dev
```

- Pages
  - Issuer Dashboard - http://localhost:5173/createTemplate :: [reference](#issuer-dashboard)
  - Issue Credential Screen - http://localhost:5173/issueCredential :: [reference](#issue-credential-screen)
  - Recipient View Page - http://localhost:5173/recipientView :: [reference](#recipient-view)
  - Verification Page - http://localhost:5173/verification :: [reference](#verification-flow)

## solana ( Anchor Framework )

- Init :: anchor init solana

- To Build :: anchor build

- IDL (Interface Description Language) - target/idl/solana.json

## backend (Node.js + Express + MongoDB)

- INIT :: npx express-generator-typescript backend

- TO run Locally ::

```
cd backend
npm install
npm run dev:hot
```

- APIS

  - /api/templates - POST call to create a template
  - /api/templates - GET call to get all the available templates
  - /api/credentials - POST call to store metadata
  - /api/credentials - GET call to fetch all the credentials issued
  - /api/credentials/by-name - POST call to fetch credentials based on Recipient Name
  - /api/credentials/verify/:credentialId - GET call to verify the certificateId/credentialId issued on solana

# Important things to Refer

- [project structure](#project-structure)
- [Architecture](#-system-architecture-documentation)

## Refer Frontend Pages Here

### Issuer Dashboard

- Create custom templates

- Add/edit/delete fields

- Upload logo & signature

- Real-time certificate preview

- Save templates to MongoDB

![Ai Certs Solana project](images/AiCerts/screencapture-localhost-5173-createTemplate-2025-12-02-14_34_08.png)

### Issue Credential Screen

- Select template

- Fill credential fields

- Enter Issuer wallet

- Backend hashes metadata

- PDA generated using Solana program ( metadata hash + issuer pubkey )

- Only hash + owner stored on-chain

- Metadata stored off-chain

![Ai Certs Solana project](images/AiCerts/screencapture-localhost-5173-issueCredential-2025-12-02-12_01_27.png)

### Recipient View

- View all credentail certificates

- Display certificate in styled layout

- Shareable credential link

![Ai Certs Solana project](images/AiCerts/screencapture-localhost-5173-recipientView-2025-12-02-12_09_58.png)

### Verification Flow

- Enter credential ID

- Fetch PDA from blockchain

- Fetch stored metadata from backend

- Compare hashes → VALID / INVALID

![Ai Certs Solana project](images/AiCerts/screencapture-localhost-5173-verification-2025-12-02-12_10_24.png)

| Layer                             | Technology                |
| --------------------------------- | ------------------------- |
| Frontend                          | React + Vite + TypeScript |
| Backend                           | Node.js + Express.js      |
| Database                          | MongoDB (Mongoose)        |
| Blockchain                        | Solana + Anchor           |
| Hashing                           | SHA-256 (js-sha256)       |
| Wallet                            | Phantom / Solana Web3.js  |
| Deployment ( smart contracts)     | Devnet cluster            |
| Deployment ( frontend , backend ) | vercel                    |

# Project Structure

```bash
aicerts-solana-project/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── solanaService.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── idl/solana.json
│   │   └── utils/
│   └── package.json
│
└── programs/
    └── solana/
        ├── src/lib.rs
        ├── Cargo.toml
        └── Anchor.toml
```

### 🟦 SYSTEM ARCHITECTURE DOCUMENTATION

🧱 Architecture Overview

This platform follows a hybrid on-chain + off-chain design:

✔ On-Chain (Minimal storage)

Stored inside a PDA account:

credentialHash → 32 bytes

ownerPublicKey → credential owner

(Implicit) credentialId → PDA public key

✔ Off-Chain (MongoDB)

Stored in backend:

Full metadata JSON

templateId

logo & signature (base64 or URL)

txSignature

issuerPublicKey

issueDate / expiry

link

✔ Why hybrid?

On-chain storage is expensive

Only proof must be immutable

Metadata changes frequently

Verification requires hash comparison

🗺️ End-to-End Architecture Diagram

```bash
                       ┌───────────────────────┐
                       │   Issuer Dashboard    │
                       │ (React + Template UI) │
                       └───────────┬───────────┘
                                   │
                                   │ POST Template
                                   ▼
                      ┌───────────────────────────┐
                      │ Backend (Express + Mongo) │
                      │ Saves Templates / Metadata│
                      └───────────┬───────────────┘
                                  │
                                  │ Issue Credential
                                  ▼
                      ┌───────────────────────────┐
                      │ Backend Solana Service    │
                      │ - hash metadata           │
                      │ - derive PDA              │
                      │ - send tx on-chain        │
                      └──────────┬────────────────┘
                                 │
                                 ▼
                       ┌──────────────────────┐
                       │   Solana Blockchain  │
                       │ Stores hash + owner  │
                       └──────────┬───────────┘
                                  │
                   GET Credential ▼
                       ┌──────────────────────┐
                       │  Recipient View UI   │
                       │ Verifies on-chain    │
                       └──────────────────────┘
```
