use anchor_lang::prelude::*;

declare_id!("EtcxZLVKnZBwHsMgFt8kuAZ3eenMgcZi5YWSNGmJYxDA");

#[program]
pub mod credential_program {
    use super::*;

    /// Stores the credential hash & owner.
    pub fn create_credential(
        ctx: Context<CreateCredential>,
        credential_hash: [u8; 32],
    ) -> Result<()> {
        let account = &mut ctx.accounts.credential_account;

        account.credential_hash = credential_hash;
        account.owner = ctx.accounts.owner.key(); // recipient of credential

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(credential_hash: [u8; 32])]
pub struct CreateCredential<'info> {
    #[account(
        init,
        payer = payer,
        space = CredentialAccount::space(),
        seeds = [
            b"credential",
            owner.key().as_ref(),      // recipient pubkey
            credential_hash.as_ref()   // unique hash
        ],
        bump
    )]
    pub credential_account: Account<'info, CredentialAccount>,

    /// This is the person who pays the Solana fee + signs the tx (the issuer)
    #[account(mut)]
    pub payer: Signer<'info>,

    /// This is the owner of the credential (recipient)
    pub owner: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct CredentialAccount {
    pub credential_hash: [u8; 32],
    pub owner: Pubkey,
}

impl CredentialAccount {
    pub const fn space() -> usize {
        // discriminator (8)
        // credential_hash (32)
        // owner (32)
        8 + 32 + 32
    }
}
