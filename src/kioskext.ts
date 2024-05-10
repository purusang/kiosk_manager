import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeyAndClient, getEnv } from "./utils";

// We need a Sui Client. You can re-use the SuiClient of your project
// (it's not recommended to create a new one).
// const client = new SuiClient({ url: getFullnodeUrl('testnet') });
// // Now we can use it to create a kiosk Client.
let mnemonics: string = getEnv("MNEMONICS1"); //...77ce308725b1ec84                    // caller/signer mnemonic  
const { keypair, client } = getKeyAndClient(mnemonics);
const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
});
const address = "0x0850b12520f4f23a1510cf23ae06a34c073c2582c47d59bdddc6b85a59253eb7";   // caller address


const get_EXT = async (kiosk: string, item: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageID}::marketplace::getter_ext`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
        ],
        // typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

const extension_add = async ( kiosk: string, capitem: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk_extension::add`,
        arguments: [
            get_EXT, 
            tx.object(kiosk),
            tx.object(cap),
            //tx.pure.u128(''), permissions
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

const disable_extension = async ( kiosk: string, capitem: string, itemType: string, cap: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk_extension::add`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            //tx.pure.u128(''), permissions
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

const ext_place = async (kiosk: string, item: string, itemType: string, policyId: any) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk_extension::place`,
        arguments: [
            tx.object(kiosk),
            //tx.object(cap),
            tx.object(item),
            tx.object(policyId),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}

// const ext_lock = async (kiosk: string, )