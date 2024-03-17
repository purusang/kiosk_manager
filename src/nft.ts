import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";



type SuiEnvs = "testnet" | "devnet" | "localnet"
dotenv.config();

const getEnv = (key: string) : SuiEnvs => {
    const value = process.env[key] || '';
    if (!value) {
        console.error( `{key} not found in environment variables.`);
        process.exit(1); // Exit the program if MNEMONICS is not set.
    }
    return value as SuiEnvs;
}
// get tokens from the Testnet faucet server
// const getGasFaucet = async (address:string) =>{
//     const suienv: SuiEnvs = getEnv("SUIENV");
//     await requestSuiFromFaucetV0({
//       // connect to Devnet
//         host: getFaucetHost(suienv),
//         recipient: address,
//     });
// }
const getKeyAndClient = (MNEMONICS:string) => {
    const keypair = Ed25519Keypair.deriveKeypair(MNEMONICS);
    const client = new SuiClient({
        url: getFullnodeUrl('testnet'),
    });
    console.log(keypair, client)
    return { keypair, client };
}
const mint = async (mnemonics: string, packageId:string) => {
    const tx = new TransactionBlock();
    const { keypair, client } = getKeyAndClient(mnemonics);
    tx.moveCall({
        target: `${packageId}::nft::mint`,
        // arguments: [
        //     tx.object(Treasury),
        // ],
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result}`);
}
async function main(){
    // let packageId :string = "0xff0ad00294545fd4230278d44de19376da4df216eba1a89eb00f73496c15d031";
    let mnemonics : string = getEnv("MNEMONICS1"); //...77ce308725b1ec84
    const packageId = "0xff0ad00294545fd4230278d44de19376da4df216eba1a89eb00f73496c15d031";
    mint(mnemonics, packageId);
}
main();