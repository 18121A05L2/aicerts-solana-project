import { useState } from "react";
import "./IssuerTemplateCreator.css";
import { backendDomain } from "../constants";
import { toast } from "react-toastify";
import { PreviewSection } from "./PreviewSection";

type TemplateField = {
  id: string;
  label: string;
  type: string;
  value: string;
  required: boolean;
};

export function IssuerTemplateCreator() {
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([
    // Editable user fields
    {
      id: "recipientName",
      label: "Recipient Name*",
      type: "text",
      value: "",
      required: true,
    },
    {
      id: "issuerName",
      label: "Issuer Name*",
      type: "text",
      value: "",
      required: true,
    },
    {
      id: "courseTitle",
      label: "Course Title*",
      type: "text",
      value: "",
      required: true,
    },
    {
      id: "expireInDays",
      label: "Expire In Days*",
      type: "number",
      value: "",
      required: true,
    },

    // Preview-only fields
    {
      id: "issuerPublicKey",
      label: "Issuer Public Key*",
      type: "text",
      value: "",
      required: true,
    },
    {
      id: "issueDate",
      label: "Issue Date*",
      type: "readonly",
      value: "{auto}",
      required: true,
    },
    {
      id: "txSignature",
      label: "Tx Signature*",
      type: "readonly",
      value: "{auto}",
      required: true,
    },
    {
      id: "credentialHash",
      label: "Credential Hash*",
      type: "readonly",
      value: "{auto}",
      required: true,
    },
  ]);

  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  // TODO : move these to fields
  const [logo, setLogo] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const handleFieldChange = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const addNewField = () => {
    if (!newFieldLabel.trim())
      return toast("Field label cannot be empty", {
        className: "toast-red-text",
      });

    const id = newFieldLabel.toLowerCase().replace(/\s+/g, "-");

    setFields((prev) => [
      ...prev,
      {
        id,
        label: newFieldLabel,
        type: newFieldType,
        value: "",
        required: false,
      },
    ]);

    setNewFieldLabel("");
    setNewFieldType("text");
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast("Template name is required", { className: "toast-red-text" });
      return;
    }
    setIsSavingTemplate(true);

    const payload = {
      templateName,
      fields: fields,
      ...(logo && { logo }),
      ...(signature && { signature }),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${backendDomain}/api/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast("Template saved successfully!", { className: "toast-green-text" });
      // Empty all data
      setTemplateName("");
      setFields((prev) => {
        return prev
          .map((f) => {
            f.value = "";
            return f;
          })
          .filter((f) => f.required);
      });
      setLogo(null);
      setSignature(null);
    } catch (err) {
      toast("Error saving template", { className: "toast-red-text" });
      console.error(err);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <div className="issuer-container">
      {/* Left Section */}
      <div className="form-section">
        <h2>Create Credential Template</h2>

        {/* Template Name */}
        <div className="input-wrapper">
          <label>Template Name*</label>
          <input
            className="input-box"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. Course Completion Certificate"
          />
        </div>

        <h4 className="required-fields">Add / Edit fields</h4>

        {/* Existing Fields */}
        <div className="field-list">
          {fields.map((field) => (
            <div key={field.id} className="input-wrapper field-row">
              <label>{field.label}</label>

              {field.type === "readonly" ? (
                <></>
              ) : field.type === "textarea" ? (
                <textarea
                  placeholder={field.label}
                  className="input-box"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.label}
                  className="input-box"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              )}

              {!field.required && (
                <button
                  className="delete-btn"
                  onClick={() => deleteField(field.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Field */}
        <div className="add-field-box">
          <input
            className="input-box"
            placeholder="New field label"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
          />

          <select
            className="input-box"
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
          </select>

          <button className="add-field-btn" onClick={addNewField}>
            + Add Field
          </button>
        </div>

        <hr className="divider" />

        {/* Uploads */}
        <div className="upload-wrapper">
          <label>Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, (v) => setLogo(v))}
          />
        </div>

        <div className="upload-wrapper">
          <label>Upload Signature</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, (v) => setSignature(v))}
          />
        </div>

        {/* Save Template */}
        <button
          className="save-template-btn"
          onClick={saveTemplate}
          disabled={isSavingTemplate}
        >
          {isSavingTemplate ? "Saving..." : "Save Template"}
        </button>
      </div>
      {/* Preview Section — unchanged */}
      <PreviewSection data={{ fields, logo, signature }} />
    </div>
  );
}
