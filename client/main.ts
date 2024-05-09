import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,    
} from '@solana/web3.js';

import * as borsh from 'borsh';

import path from 'path';
import { getLocalAccount } from './getLocalAccount';
import { createKeypairFromFile } from './utils';
import { SIZE, Token, TotalTokensSchema } from './token';

let programKeypair: Keypair;
let connection: Connection;
let programId: PublicKey;
let clientPubKey: PublicKey;

const PROGRAM_PATH = path.resolve(__dirname, '../dist/program');

export async function connect() {  
  connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  console.log(`Successfully connected to Solana local net.`);
}

export async function getProgram(programName: string) {  
  programKeypair = await createKeypairFromFile(
      path.join(PROGRAM_PATH, programName + '-keypair.json')
  );
  programId = programKeypair.publicKey;

  console.log(`We're going to ping the ${programName} program.`);
  console.log(`It's Program ID is: ${programId.toBase58()}`);  
}

export async function configureClientAccount(accountSpaceSize: number) {    
  const SEED = 'newSeed';
  const localKeypairGetAccount: Keypair = await getLocalAccount();
  clientPubKey = await PublicKey.createWithSeed(
      localKeypairGetAccount.publicKey,
      SEED,
      programId,
  );

  console.log("Total lenght: ", accountSpaceSize);  
  console.log(`The generated address is: ${clientPubKey.toBase58()}`);  
  
  const clientAccount = await connection.getAccountInfo(clientPubKey);
  if (clientAccount === null) {

      console.log(`the account does not exist. we create it.`);
      
      const transaction = new Transaction().add(
          SystemProgram.createAccountWithSeed({
              fromPubkey: localKeypairGetAccount.publicKey,
              basePubkey: localKeypairGetAccount.publicKey,
              seed: SEED,
              newAccountPubkey: clientPubKey,
              lamports:  2 * LAMPORTS_PER_SOL,
              space: accountSpaceSize,
              programId,
          }),
      );      
      await sendAndConfirmTransaction(connection, transaction, [localKeypairGetAccount]);
      
      console.log(`Client account created`);
  } else {
      console.log(`the account exists already. We can just use it.`);
  }
}

export async function pingProgram(programName: string) {  
  console.log(`Pinging ${programName} program`);

  const localKeypairGetAccount: Keypair = await getLocalAccount();
  
  // Serialize data
  const serializedData = borsh.serialize( 
    TotalTokensSchema,
    new Token({ lamports: 50891949 })
  );

  // Create a Buffer
  const data = Buffer.from(serializedData);

  const instruction = new TransactionInstruction({
      keys: [{pubkey: clientPubKey, isSigner: false, isWritable: true}],
      programId,      
      data,
  });
  await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),            
      [localKeypairGetAccount],
  );

  console.log(`Ping ok`);
}

async function main() {    
  await connect();    
  await getProgram('test');  
  await configureClientAccount(SIZE);
  await pingProgram('test');
}

  
main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  },
);