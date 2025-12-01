import { useEffect, useState } from "react";
import "./IssueCredential.css";
import { toast } from "react-toastify";
import { backendDomain } from "../constants";

type TemplateField = {
  id: string;
  label: string;
  type: string;
  value?: string;
};

type Template = {
  _id: { oid: string };
  templateName: string;
  fields: TemplateField[];
  logo?: string;
  signature?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function IssueCredential() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [credentialData, setCredentialData] = useState(
    {} as {
      metadata: any;
      credentialId: string;
      credentialHash: string;
      txSignature: string;
    }
  );

  const [recipientWallet, setRecipientWallet] = useState("");
  const [metadata, setMetadata] = useState<any>(null);

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // TODO : uncomment this
        const res = await fetch(`${backendDomain}/api/templates`);
        const data = await res.json();
        // const data = templatesData;

        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates", err);
      }
    };

    fetchTemplates();
  }, []);

  // Handle field input
  const handleFieldChange = (fieldId: string, value: string) => {
    setSelectedTemplate((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        fields: prev.fields.map((field) =>
          field.id === fieldId ? { ...field, value } : field
        ),
      };
    });
  };

  // Generate metadata to be hashed + submitted to Solana
  const generateMetadata = () => {
    if (!selectedTemplate) return toast.error("Please select a template");
    if (!recipientWallet.trim())
      return toast.error("Recipient wallet required");

    const isEmptyData = selectedTemplate.fields.some(
      (field) => field.type !== "readonly" && !field.value
    );
    if (isEmptyData) {
      return toast.error("All fields are required");
    }

    const metadataObj = {
      templateId: selectedTemplate._id,
      templateName: selectedTemplate.templateName,
      recipientWallet,
      fields: selectedTemplate.fields,
      logo: selectedTemplate.logo ?? null,
      signature: selectedTemplate.signature ?? null,
      issuedAt: new Date().toISOString(),
    };
    console.log({ metadataObj });

    setMetadata(metadataObj);
  };

  const issueCredential = async () => {
    if (!metadata) return toast.error("Please generate metadata first");
    // 6. Save in backend
    try {
      const res = await fetch(`${backendDomain}/api/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata,
          createdAt: new Date().toISOString(),
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        setCredentialData(data);
        toast.success("Credential stored in backend!");
      } else {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (err) {
      console.log({ err });
      toast.error(`Issuance failed: ${err?.message}`);
    }
  };

  return (
    <div className="issue-container">
      {/* Left side */}
      <div className="issue-left">
        <h2>Issue Credential</h2>

        {/* Select Template */}
        <label className="label">Select Template</label>
        <select
          className="dropdown"
          onChange={(e) => {
            const temp = templates.find(
              (t) => t.templateName === e.target.value
            );
            setSelectedTemplate(temp || null);

            setMetadata(null);
          }}
        >
          <option value="">-- Select Template --</option>
          {templates.map((t) => (
            <option key={t._id?.$oid} value={t.templateName}>
              {t.templateName}
            </option>
          ))}
        </select>

        {/* Recipient Wallet */}
        <div className="input-row">
          <label>Recipient Wallet Address</label>
          <input
            type="text"
            className="input-box"
            placeholder="Enter Solana wallet address"
            value={recipientWallet}
            onChange={(e) => setRecipientWallet(e.target.value)}
          />
        </div>

        {/* Fields */}
        {selectedTemplate && (
          <div className="fields-area">
            <h4>Fill Credential Details</h4>

            {selectedTemplate.fields.map((field) =>
              field.type === "readonly" ? (
                <></>
              ) : (
                <div key={field.id} className="input-row">
                  <label>{field.label}</label>
                  <input
                    type={field.type ?? "text"}
                    className="input-box"
                    placeholder={field.label}
                    //   value={fieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleFieldChange(field.id, e.target.value)
                    }
                  />
                </div>
              )
            )}

            <button className="generate-btn" onClick={generateMetadata}>
              Generate Metadata
            </button>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="issue-right">
        <h3>Metadata Preview</h3>

        {!metadata && <p className="placeholder">Metadata will appear here…</p>}

        {metadata && (
          <pre className="metadata-box">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        )}

        <button
          className="issue-btn"
          disabled={!metadata}
          onClick={issueCredential}
        >
          Issue Credential on Solana
        </button>
        {credentialData?.credentialId && (
          <p>
            <a
              href={`/verification?credentialId=${credentialData.credentialId}`}
            >
              Verify Transaction Here
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
