interface Window {
  solana?: {
    isPhantom?: boolean;
    publicKey?: import("@solana/web3.js").PublicKey;
    connect: () => Promise<{ publicKey: import("@solana/web3.js").PublicKey }>;
    disconnect: () => Promise<void>;
  };
}
