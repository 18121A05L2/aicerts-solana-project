/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./IssueCredential.css";
import { toast } from "react-toastify";
import { backendDomain } from "../constants";
import { PreviewSection } from "../template/PreviewSection";
import { JsonView, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { isValidSolanaPublicKey } from "../utils/validation";

function normalizeMetadata(metadata: any) {
  const cleanedFields = {} as any;

  metadata.fields.forEach((field: any) => {
    // only include fields with a defined value
    if (field.value !== undefined && field.value !== null) {
      cleanedFields[field.id] = field.value;
    }
  });

  return {
    templateId: metadata.templateId,
    templateName: metadata.templateName,
    issuedAt: metadata.issuedAt,
    fields: cleanedFields,
  };
}

type TemplateField = {
  id: string;
  label: string;
  type: string;
  value?: string;
};

type Template = {
  _id: { $oid: string };
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
  const [isLoading, setIsLoading] = useState(false);

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

    const isEmptyData = selectedTemplate.fields.some(
      (field) => field.type !== "readonly" && !field.value
    );
    const isValidSolanaAddress = isValidSolanaPublicKey(
      selectedTemplate.fields.find((field) => field.id === "issuerPublicKey")
        ?.value ?? ""
    );
    if (!isValidSolanaAddress) {
      return toast.error("Please enter a valid Solana address");
    }
    if (isEmptyData) {
      return toast.error("All fields are required");
    }

    const metadataObj = {
      templateId: selectedTemplate._id,
      templateName: selectedTemplate.templateName,
      fields: selectedTemplate.fields,
      ...(selectedTemplate.logo && { logo: selectedTemplate.logo }),
      ...(selectedTemplate.signature && {
        signature: selectedTemplate.signature,
      }),
      issuedAt: new Date().toISOString(),
    };

    setMetadata(metadataObj);
  };
  // TODO : clear all data once certificate is issued
  const issueCredential = async () => {
    setIsLoading(true);

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
    } catch (err: any) {
      console.log({ err });
      toast.error(`Issuance failed: ${err?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="issue-main">
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
          <PreviewSection
            data={{
              fields: selectedTemplate?.fields,
              logo: selectedTemplate?.logo,
              signature: selectedTemplate?.signature,
              credentialId: credentialData.credentialId,
            }}
          />

          <button
            className="issue-btn"
            disabled={!metadata}
            onClick={issueCredential}
          >
            {isLoading ? "Issuing..." : "   Issue Credential on Solana"}
          </button>
          {credentialData?.credentialId && (
            <p>
              <a
                href={`/verification?credentialId=${credentialData.credentialId}`}
                target="_blank"
              >
                Verify Transaction Here
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="metadata-container">
        <h3 className="metadata-title">Metadata Preview</h3>

        {!metadata && <p className="placeholder">Metadata will appear here…</p>}

        {metadata && (
          <JsonView data={normalizeMetadata(metadata)} style={darkStyles} />
        )}
      </div>
    </div>
  );
}
