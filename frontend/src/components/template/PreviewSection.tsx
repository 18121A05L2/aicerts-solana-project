/* eslint-disable @typescript-eslint/no-explicit-any */
export const PreviewSection = ({ data }: any) => {
  const { fields, logo, signature } = data;

  if (!fields) return <></>;

  const addDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  };
  return (
    <div className="preview-section">
      <h3>Real-time Certificate Preview</h3>

      <div className="certificate">
        {logo && <img src={logo} alt="Logo" className="certificate-logo" />}
        <h1 className="cert-title-main">AI CERTs™</h1>
        <p className="cert-subtext">This is to certify that</p>
        <h2 className="cert-recipient">
          {fields.find((f: any) => f.id === "recipientName")?.value ||
            "Recipient Name"}
        </h2>
        <p className="cert-description">
          Has successfully completed the requirements to be recognized as
        </p>
        <h2 className="cert-credential">
          {fields.find((f: any) => f.id === "courseTitle")?.value ||
            "Course Title"}
        </h2>

        <div className="signature-block">
          {signature && (
            <img src={signature} alt="Signature" className="signature-img" />
          )}
          <p className="signature-label">
            Issued by{" "}
            <strong>
              {fields.find((f: any) => f.id === "issuerName")?.value ||
                "Issuer Name"}
            </strong>
          </p>
        </div>

        <div className="footer-row">
          <p className="footer-fields">
            <strong>Certification No:</strong>{" "}
            {fields.find((f: any) => f.id === "score")?.value || "913bb8091533"}
          </p>
          <p className="footer-fields">
            <strong>Issued On:</strong>
            {new Date().toLocaleDateString()}
          </p>
          <p className="footer-fields">
            <strong>Expires On:</strong>
            {addDays(
              Number(fields.find((f: any) => f.id === "expireInDays")?.value) ||
                0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
