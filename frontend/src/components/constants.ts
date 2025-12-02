export const backendDomain = import.meta.env.VITE_BACKEND_URL;

export const templatesData = [
  {
    _id: { $oid: "692c211dfcf52b923dc96661" },
    templateName: "Aicerts",
    fields: [
      {
        id: "recipientName",
        label: "Recipient Name*",
        type: "text",
        _id: { $oid: "692c211dfcf52b923dc96662" },
      },
      {
        id: "issuerName",
        label: "Issuer Name*",
        type: "text",
        _id: { $oid: "692c211dfcf52b923dc96663" },
      },
      {
        id: "courseTitle",
        label: "Course Title*",
        type: "text",
        _id: { $oid: "692c211dfcf52b923dc96664" },
      },
      {
        id: "expireInDays",
        label: "Expire In Days*",
        type: "number",
        _id: { $oid: "692c211dfcf52b923dc96665" },
      },
      {
        id: "issueDate",
        label: "Issue Date*",
        type: "readonly",
        _id: { $oid: "692c211dfcf52b923dc96666" },
      },
      {
        id: "txSignature",
        label: "Tx Signature*",
        type: "readonly",
        _id: { $oid: "692c211dfcf52b923dc96667" },
      },
      {
        id: "issuerPublicKey",
        label: "Issuer Public Key*",
        type: "readonly",
        _id: { $oid: "692c211dfcf52b923dc96668" },
      },
      {
        id: "credentialHash",
        label: "Credential Hash*",
        type: "readonly",
        _id: { $oid: "692c211dfcf52b923dc96669" },
      },
      {
        id: "test",
        label: "test",
        type: "text",
        _id: { $oid: "692c211dfcf52b923dc9666a" },
      },
    ],
    createdAt: { $date: { $numberLong: "1764499741596" } },
    updatedAt: { $date: { $numberLong: "1764499741596" } },
    __v: { $numberInt: "0" },
  },
  {
    _id: { $oid: "692c21eafcf52b923dc96678" },
    templateName: "coursera",
    fields: [
      {
        id: "recipientName",
        label: "Recipient Name*",
        type: "text",
        _id: { $oid: "692c21eafcf52b923dc96679" },
      },
      {
        id: "issuerName",
        label: "Issuer Name*",
        type: "text",
        _id: { $oid: "692c21eafcf52b923dc9667a" },
      },
      {
        id: "courseTitle",
        label: "Course Title*",
        type: "text",
        _id: { $oid: "692c21eafcf52b923dc9667b" },
      },
      {
        id: "expireInDays",
        label: "Expire In Days*",
        type: "number",
        _id: { $oid: "692c21eafcf52b923dc9667c" },
      },
      {
        id: "issueDate",
        label: "Issue Date*",
        type: "readonly",
        _id: { $oid: "692c21eafcf52b923dc9667d" },
      },
      {
        id: "txSignature",
        label: "Tx Signature*",
        type: "readonly",
        _id: { $oid: "692c21eafcf52b923dc9667e" },
      },
      {
        id: "issuerPublicKey",
        label: "Issuer Public Key*",
        type: "readonly",
        _id: { $oid: "692c21eafcf52b923dc9667f" },
      },
      {
        id: "credentialHash",
        label: "Credential Hash*",
        type: "readonly",
        _id: { $oid: "692c21eafcf52b923dc96680" },
      },
      {
        id: "score",
        label: "score",
        type: "text",
        _id: { $oid: "692c21eafcf52b923dc96681" },
      },
      {
        id: "description",
        label: "description",
        type: "text",
        _id: { $oid: "692c21eafcf52b923dc96682" },
      },
    ],
    createdAt: { $date: { $numberLong: "1764499946857" } },
    updatedAt: { $date: { $numberLong: "1764499946857" } },
    __v: { $numberInt: "0" },
  },
];
