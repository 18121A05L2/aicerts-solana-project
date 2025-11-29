use anchor_lang::prelude::*;

declare_id!("EtcxZLVKnZBwHsMgFt8kuAZ3eenMgcZi5YWSNGmJYxDA");

#[program]
pub mod solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
