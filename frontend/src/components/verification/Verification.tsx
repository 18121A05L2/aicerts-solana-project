/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import "./Verification.css";

import { backendDomain } from "../constants";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export function Verification() {
  const [searchParams] = useSearchParams();
  const credentialIdFromParams = searchParams.get("credentialId");
  const [credentialId, setCredentialId] = useState<string>("");
  const [errorData, setErrorData] = useState<any>(null);

  const [metadata, setMetadata] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState("");

  const [onchainData, setOnchainData] = useState<any>(null);

  // -----------------------------
  // Verify Against On-Chain Data
  // -----------------------------
  const verify = async () => {
    if (!credentialId && !credentialIdFromParams) {
      toast.error("Please enter a valid credential ID");
    }
    try {
      const res = await fetch(
        `${backendDomain}/api/credentials/${
          credentialId ? credentialId : credentialIdFromParams
        }`
      );
      const data = await res.json();

      if (res.status === 200) {
        setMetadata(data);
        setOnchainData(data.onChainData);
        setVerificationStatus("valid");
      } else {
        setErrorData(data);
        setVerificationStatus("invalid");
      }
    } catch (err) {
      console.error(err);
      setVerificationStatus("invalid");
    }
  };
  console.log({ verificationStatus });

  useEffect(() => {
    if (credentialIdFromParams && !credentialId) {
      (async () => {
        await verify();
      })();
    }
  }, [credentialIdFromParams]);

  if (!metadata) {
    return (
      <div className="verification-container">
        <div className="verification-input">
          <label>Enter Credential ID:</label>
          <input
            type="text"
            onChange={(e) => setCredentialId(e.target.value)}
          ></input>
        </div>
        <button className="verify-button" onClick={verify}>
          Verify
        </button>
        {errorData && <p className="error-msg">{errorData.message}</p>}
      </div>
    );
  }

  return (
    <div className="recipient-container">
      <div className="recipient-credential-card">
        <h1 className="verification-header">Credential</h1>

        {/* Verification Status */}
        <div
          className={`verification-status ${
            verificationStatus === "valid" && "valid"
          } ${verificationStatus === "loading" && "loading"}
            ${verificationStatus === "invalid" && "invalid"}`}
        >
          {verificationStatus === "valid" ? "VALID ✔" : "INVALID ✖"}
        </div>

        {/* Certificate Layout */}
        <div className="certificate-view">
          {metadata?.metadata?.logo && (
            <img
              src={metadata.metadata.logo}
              alt="Logo"
              className="certificate-logo"
            />
          )}

          <h2 className="recipient-name">
            {metadata.metadata?.fields.find(
              (f: any) => f.id === "recipientName"
            )?.value || "Recipient"}
          </h2>

          <p>
            Successfully completed:
            <br />
            <strong>
              {
                metadata.metadata?.fields.find(
                  (f: any) => f.id === "courseTitle"
                )?.value
              }
            </strong>
          </p>

          {metadata.metadata.signature && (
            <img
              src={metadata.metadata.signature}
              alt="Signature"
              className="signature-img"
            />
          )}

          <p className="issuer-line">
            Issued by:{" "}
            {
              metadata.metadata.fields.find((f: any) => f.id === "issuerName")
                ?.value
            }
          </p>

          <p className="issued-date">
            Issued At: {metadata.metadata.issuedAt.substring(0, 10)}
          </p>
        </div>

        {/* On-chain details */}
        {onchainData && (
          <div className="onchain-box">
            <p>
              <strong>Credential ID:</strong> {credentialId}
            </p>
            <p>
              <strong>Owner (Wallet):</strong> {onchainData.owner.toBase58()}
            </p>
            <p>
              <strong>Tx:</strong>{" "}
              <a
                href={`https://explorer.solana.com/tx/${metadata.txSignature}?cluster=devnet`}
                target="_blank"
              >
                View Transaction
              </a>
            </p>
          </div>
        )}
      </div>
      <div>
        <a
          className="transaction-link"
          href={`https://solscan.io/tx/${metadata.txSignature}?cluster=devnet`}
          target="_blank"
        >
          Check your transaction in solscan
        </a>
      </div>
    </div>
  );
}
