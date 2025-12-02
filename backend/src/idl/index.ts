import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { sha256 } from "js-sha256";
// @ts-ignore
import IDL from "../idl/solana.json";

const NETWORK = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey(IDL.address);

const connection = new Connection(NETWORK, "confirmed");

let ISSUER_KEYPAIR: Keypair;

function getProvider() {
  // ---- Load issuer wallet (backend signer) ----
  if (!ISSUER_KEYPAIR) {
    ISSUER_KEYPAIR = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(process.env.ADMIN_SECRET_KEY!))
    );
  }

  console.log("Backend Issuer Wallet:", ISSUER_KEYPAIR.publicKey.toBase58());

  return new AnchorProvider(
    connection,
    {
      publicKey: ISSUER_KEYPAIR.publicKey,
      signTransaction: async (tx: any) => {
        tx.partialSign(ISSUER_KEYPAIR);
        return tx;
      },
      signAllTransactions: async (txs: any) => {
        txs.forEach((tx: any) => tx.partialSign(ISSUER_KEYPAIR));
        return txs;
      },
    } as any,
    {}
  );
}

function getProgram(provider: AnchorProvider) {
  return new Program(IDL as any, provider);
}

export async function issueCredential(metadata: any) {
  try {
    // 1. Setup provider & program
    const provider = getProvider();
    const program = getProgram(provider);

    // 2. Hash metadata
    const metadataString = JSON.stringify(metadata);
    const hashHex = sha256(metadataString);
    const hashBytes = Buffer.from(hashHex, "hex");
    const credentialHashArray = Array.from(hashBytes);

    const issuerPublicKey = metadata.fields.find(
      (field: any) => field.id === "issuerPublicKey"
    ).value;

    // 3. Issuer public key
    const owner = new PublicKey(issuerPublicKey);

    // 4. Derive PDA
    const [credentialPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("credential"), owner.toBuffer(), hashBytes],
      PROGRAM_ID
    );

    console.log("Credential PDA:", credentialPda.toBase58());

    // 5. Call Anchor program from backend
    const txSignature = await program.methods
      .createCredential(credentialHashArray)
      .accounts({
        credentialAccount: credentialPda,
        payer: ISSUER_KEYPAIR.publicKey, // backend wallet
        owner,
        systemProgram: SystemProgram.programId,
      })
      .signers([ISSUER_KEYPAIR])
      .rpc();

    console.log("Tx:", txSignature);

    return {
      credentialId: credentialPda.toBase58(),
      credentialHash: hashHex,
      txSignature,
      issuer: ISSUER_KEYPAIR.publicKey.toBase58(),
    };
  } catch (err) {
    console.error(err);
    if (err.message.includes("already in use")) {
      throw new Error("Certificate already issued.");
    }
    throw new Error("Credential issuance failed (backend).");
  }
}

export const verify = async (credentialId: string, metadata: any) => {
  if (!credentialId) {
    throw new Error("Please enter a valid credential ID");
  }

  try {
    // Setup Solana Connection + Provider (anonymous)
    const provider = getProvider();
    const program = getProgram(provider);
    // Fetch PDA account
    // @ts-ignore
    const account = await program.account.credentialAccount.fetch(
      new PublicKey(credentialId!)
    );

    // Re-hash metadata and compare with onchain
    const metadataString = JSON.stringify(metadata);
    const hashHex = sha256(metadataString);
    const hashBytes = Buffer.from(hashHex, "hex");
    const matches =
      Buffer.compare(hashBytes, Buffer.from(account.credentialHash)) === 0;
    if (!matches) {
      throw new Error("Metadata mismatch");
    } else {
      return { isValid: true };
    }
  } catch (err) {
    console.error(err);
    return { err };
  }
};
