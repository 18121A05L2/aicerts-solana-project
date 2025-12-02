export const IDL = {
  address: "EtcxZLVKnZBwHsMgFt8kuAZ3eenMgcZi5YWSNGmJYxDA",
  metadata: {
    name: "credential_program",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "create_credential",
      docs: ["Stores the credential hash & owner."],
      discriminator: [205, 74, 60, 212, 63, 198, 196, 109],
      accounts: [
        {
          name: "credential_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],
              },
              {
                kind: "account",
                path: "owner",
              },
              {
                kind: "arg",
                path: "credential_hash",
              },
            ],
          },
        },
        {
          name: "payer",
          docs: [
            "This is the person who pays the Solana fee + signs the tx (the issuer)",
          ],
          writable: true,
          signer: true,
        },
        {
          name: "owner",
          docs: ["This is the owner of the credential (recipient)"],
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "credential_hash",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "CredentialAccount",
      discriminator: [163, 33, 82, 244, 191, 35, 220, 78],
      type: {
        kind: "struct",
        fields: [
          {
            name: "credential_hash",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "owner",
            type: "pubkey",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "CredentialAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "credential_hash",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "owner",
            type: "pubkey",
          },
        ],
      },
    },
  ],
};
