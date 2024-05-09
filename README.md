# Create a program on blockchain SOLANA
- This prgram send data in the account and send lamports in instruction data

## Create lib in rust
* $ cargo new --lib test

## Create keygen
* $ solana-keygen new --force

## Install dependencies
* $ sh -c "$(curl -sSfL https://release.solana.com/v1.18.8/install)"
* $ solana-install init 1.18.8
* $ solana config get
* $ solana airdrop 3

## Setup a localhost blockchain cluster
* $ solana-test-validator

## See logs in blockchain
* $ solana logs

## See version SBF
* $ cargo-build-sbf --version

## Compile program
* $ test/cargo-build-sbf

## Deploy to blockchain
* $ test/solana program deploy ./target/deploy/test.so

## Web3 for client folder
* $ npm init
* $ npm install --save @solana/web3.js
* $ npm install typescript --save-dev
* $ npm install --save-dev ts-node
* $ npm install @types/node --save-dev

## run transactions
* $ test/npm run start


