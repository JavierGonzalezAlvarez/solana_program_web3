import {
    Keypair,
} from '@solana/web3.js';

import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import yaml from 'yaml';
import { createKeypairFromFile } from './utils';
  
const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    '.config',
    'solana',
    'cli',
    'config.yml',
);

let localKeypair: Keypair;

export async function getLocalAccount(): Promise<Keypair> {
    const configYml = await fs.readFile(CONFIG_FILE_PATH, {encoding: 'utf8'});
    const keypairPath = await yaml.parse(configYml).keypair_path;
    localKeypair = await createKeypairFromFile(keypairPath);     
    console.log(`Local account's address is: ${localKeypair.publicKey}`);    
    return localKeypair;    
}