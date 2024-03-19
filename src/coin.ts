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
const address = "0x856457e720ea48cbab8307375a9e1d826632186832bb883d20c298ecf71ae9f5";   // caller address

const splitCoin = async (coin: string, itemType: string, amt: number) => {
    const tx = new TransactionBlock();
    let split_coin = tx.moveCall({
        target: `0x02::coin::split`,
        arguments: [
            tx.object(coin),
            tx.pure.u64(amt)
        ],
        typeArguments: [itemType]
    });
    tx.moveCall({  // returns  (ID, u64, ID)
        target: `0x02::transfer::public_transfer`,
        arguments: [
            split_coin[0],
            tx.pure.address(address),
            // tx.object(coin),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
}
const coin = getEnv("COIN");
splitCoin(coin, "0x02::sui::SUI", 100000000);