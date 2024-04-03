
import * as dotenv from 'dotenv';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeyAndClient, getEnv } from "./utils";


type SuiEnvs = "testnet" | "devnet" | "localnet"
dotenv.config();

const mint = async (mnemonics: string, packageId: string) => {
    const tx = new TransactionBlock();
    const { keypair, client } = getKeyAndClient(mnemonics);
    console.log("Wallet: ", keypair.getPublicKey().toSuiAddress());
    
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
async function main() {
    let mnemonics: string = getEnv("MNEMONICS1"); //...77ce308725b1ec84
    
    let packageId: string = process.env.PACKAGE || '';
    mint(mnemonics, packageId);
}
main();