import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeyAndClient, getEnv } from "./utils";
import { create } from 'domain';

let mnemonics: string = getEnv("MNEMONICS1"); //...77ce308725b1ec84                    // caller/signer mnemonic  
const { keypair, client } = getKeyAndClient(mnemonics);
const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
});
const address = "0x856457e720ea48cbab8307375a9e1d826632186832bb883d20c298ecf71ae9f5";   // caller address


// public fun new<T>(
//     pub: &Publisher, ctx: &mut TxContext
// )
// public fun add_rule<T, Rule: drop, Config: store + drop>(
//     _: Rule, policy: &mut TransferPolicy<T>, cap: &TransferPolicyCap<T>, cfg: Config
// )

const createPolicy = async (publisher: string, itemType: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::transfer_policy::default`,
        arguments: [
            tx.object(publisher)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
}
const packageId = getEnv("PACKAGE"); // nft contract
const itemType = `${packageId}::nft::Sword`;
const publisher = getEnv("PUBLISHER");
createPolicy(publisher, itemType);