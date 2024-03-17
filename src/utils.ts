import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";



type SuiEnvs = "testnet" | "devnet" | "localnet"
dotenv.config();

export const getEnv = (key: string) : SuiEnvs => {
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
export const getKeyAndClient = (MNEMONICS:string) => {
    const keypair = Ed25519Keypair.deriveKeypair(MNEMONICS);
    const client = new SuiClient({
        url: getFullnodeUrl('testnet'),
    });
    // console.log(keypair, client)
    return { keypair, client };
}