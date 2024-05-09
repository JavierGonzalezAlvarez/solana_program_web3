use borsh::{BorshDeserialize, BorshSerialize}; 
use solana_program::{
    account_info::{next_account_info, AccountInfo}, 
    entrypoint, 
    entrypoint::ProgramResult, 
    msg, 
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Token {
    pub lamports: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct AccountSpace {
    pub size: u32,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,   
    accounts: &[AccountInfo],     
    instruction_data: &[u8],
) -> ProgramResult {    

    let accounts_iter = &mut accounts.iter();
    
    let account = next_account_info(accounts_iter)?;

    msg!("Account owner: {}", account.owner);
    msg!("ProgramID: {}", program_id);

    if account.owner != program_id {
        msg!("Account with no correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }
    
    msg!("Account:");
    msg!("Account ID: {}", account.key);
    msg!("Executable?: {}", account.executable);
    msg!("Lamports: {:#?}", account.lamports);    
    msg!("Balance (lamports): {}", account.lamports());  
    

    let account_space =  AccountSpace::try_from_slice(&account.data.borrow())?;        
    msg!("Account space SIZE: {}", account_space.size);
        
    let total_tokens: Token = Token::try_from_slice(instruction_data)
        .map_err(|_err| ProgramError::InvalidInstructionData)?;
    msg!("Received total lamports: {}", total_tokens.lamports);

    Ok(())
}