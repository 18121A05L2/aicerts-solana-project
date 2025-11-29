## 3-Day Full-Stack Blockchain Issuance Platform — Flow & Functional Requirements

### Objective

Design and implement a Blockchain-based Credential Issuance Platform using Solana. The candidate must demonstrate understanding of flows, architecture, backend logic, and user journey.

## 3-Day Task Structure

### DAY 1 — UI + User Journey + Complete Flow Explanation

Candidate must design screens and flows (Figma / Whiteboard / Basic Web UI). NO code required.

### User Roles

- **Issuer** — Creates templates & issues credentials
- **Recipient** — Receives credentials
- **Verifier** — Validates authenticity

## Required UI Screens (must be very clear)

### 1. Issuer Dashboard

- Create credential template
- Add fields (name, course, date, score, description)
- Upload logo, signature
- Real-time certificate preview

### 2. Issue Credential Screen

- Select a template
- Enter recipient details
- Generate credential metadata
- Click "Issue" to send it to blockchain

### 3. Recipient View Page

- Displays credential
- Shows details stored on blockchain
- Share link option

### 4. Verification Page

- Enter Credential ID / scan QR
- System fetches on-chain details
- Show VALID / INVALID status

## Mandatory Flows (must be extremely clear to candidate)

### **FLOW 1 — Template Creation**

**Step-by-step:**

- Issuer designs a certificate template
- System saves template as JSON
- Template ready to be used for issuance

**Outcome:** Template stored locally or off-chain.

### **FLOW 2 — Credential Issuance**

- Issuer selects template
- Fills recipient details
- System generates metadata JSON
- System creates unique credential hash
- Hash is stored on Solana
- Credential ID is generated
- Recipient receives link

**Outcome:** Credential stored on-chain via hash + metadata off-chain.

### **FLOW 3 — Recipient Flow**

- Recipient opens link
- UI fetches metadata
- UI verifies hash with on-chain data
- Shows credential on the screen

### **FLOW 4 — Verification Flow**

- Verifier enters credential ID
- System fetches record from Solana
- System matches metadata hash
- Shows verification result:

  - Valid
  - Invalid
  - Issuer details
  - Timestamp

## DAY 2 — Backend + Blockchain Architecture (No deep code)

Candidate must submit a clear write-up explaining how the backend and Solana program will work.

### 1. Required Backend APIs

- Create template
- Issue credential
- Fetch credential metadata
- Verify credential

### 2. Storage Logic

| Component | On-chain / Off-chain | Description |
| | | |
| Template | Off-chain | JSON structure |
| Metadata | Off-chain | Certificate details |
| Credential hash | On-chain (Solana PDA) | Proof + issuer pubkey |
| Credential ID | On-chain | Unique reference |

### 3. Mandatory Metadata Fields

- recipientName
- issuerName
- courseTitle
- issueDate
- txSignature
- issuerPublicKey
- credentialHash

### 4. End-to-End Technical Flow

- Backend receives credential data
- Generates metadata JSON
- Hashes metadata
- Sends hash → Solana program
- Gets transaction signature
- Saves metadata + link
- Returns credential ID

## DAY 3 — Demo Video + GitHub + Document

Candidate must submit:

### ✔ A short demo video (2–5 min) showing:

- Template creation flow
- Issuance flow
- Recipient view
- Verification screen

### ✔ GitHub Repository with:

- UI
- Backend
- Solana interaction
- README with installation + usage steps

### ✔ Final Documentation containing:

- Architecture diagram
- Flow diagrams
- API documentation
- Explanation of blockchain logic

## 🎯 Evaluation Criteria

- Clarity of UI/UX and flows
- Understanding of issuance life cycle
- Accuracy of blockchain mapping
- API design quality
- Documentation completeness
- Overall architecture thinking

If you want, I can also generate:
✅ Folder structure
✅ Architecture diagram (Mermaid)
✅ Sample API definitions
✅ Solana PDA layout

Just tell me!
