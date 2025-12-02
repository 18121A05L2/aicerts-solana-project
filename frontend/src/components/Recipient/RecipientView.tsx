/* eslint-disable @typescript-eslint/no-explicit-any */
export const RecipientView = () => {};
import { useEffect, useState } from "react";
import "./recipientView.css";
import { backendDomain } from "../constants";
import { toast } from "react-toastify";

export function RecipientDashboard() {
  const [recipientName, setRecipientName] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(`${backendDomain}/api/credentials/`);
      const data = await res.json();
      setResults(data);
    };
    if (!recipientName.trim()) {
      fetchAll();
    }
  }, [recipientName]);

  const searchCredentials = async () => {
    if (!recipientName.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${backendDomain}/api/credentials/by-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    }

    setLoading(false);
  };

  const copyShareLink = (credentialId: string) => {
    const link = `${window.location.origin}/verification?credentialId=${credentialId}`;
    navigator.clipboard.writeText(link);
    toast.info("Share link copied!");
  };

  return (
    <div className="recipient-page-container">
      <h1 className="recipient-page-title">Recipient Credentials</h1>

      {/* Search Box */}
      <div className="search-box-container">
        <input
          className="wallet-input"
          placeholder="Enter Recipient Name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />

        <button className="search-btn" onClick={searchCredentials}>
          Search
        </button>
      </div>

      {/* Loader */}
      {loading && <p className="loading-text">Loading credentials...</p>}

      {/* Results */}
      <div className="credentials-list">
        {results.length === 0 && !loading && (
          <p className="no-results">No credentials found</p>
        )}

        {results.map((cred) => (
          <div key={cred.credentialId} className="credential-card">
            <div className="credential-header">
              <h3 className="credential-title">{cred.metadata.templateName}</h3>
              <button
                className="share-btn"
                onClick={() => copyShareLink(cred.credentialId)}
              >
                Share
              </button>
            </div>

            <div className="credential-preview">
              <p>
                <strong>Recipient:</strong>{" "}
                {
                  cred.metadata.fields.find(
                    (f: any) => f.id === "recipientName"
                  )?.value
                }
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {
                  cred.metadata.fields.find((f: any) => f.id === "courseTitle")
                    ?.value
                }
              </p>

              <p>
                <strong>Issued On:</strong>{" "}
                {cred.metadata.metadataIssuedAt ??
                  cred.metadata.issuedAt?.substring(0, 10)}
              </p>

              <p>
                <strong>Credential ID:</strong> {cred.credentialId}
              </p>

              <a
                href={`https://explorer.solana.com/tx/${cred.txSignature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
              >
                View Transaction
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
