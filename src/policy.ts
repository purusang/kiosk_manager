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
const address = "0x0850b12520f4f23a1510cf23ae06a34c073c2582c47d59bdddc6b85a59253eb7";   // caller address


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
   console.log("Transfer Policy digest: ",result.digest);
}

const add_rule = async (packageId: string,policy:string, policyCap:string, itemType:string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::item_locked_policy::set`,
        arguments: [
            tx.object(policy),
            tx.object(policyCap),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}

const remove_rule = async (policy:string, policyCap:string, itemType:string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::transfer_policy::remove_rule`,
        arguments: [
            tx.object(policy),
            tx.object(policyCap),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}


const add_royalty_rule = async (packageId: string,policy:string, policyCap:string, itemType:string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::item_locked_policy::add_royalty_rule`,
        arguments: [
            tx.object(policy),
            tx.object(policyCap),
            tx.pure("10000", 'u16')
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}
const prove_is_in_rule = async (packageId: string, request:string, kiosk:string, itemType:string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::item_locked_policy::prove_is_in`,
        arguments: [
            tx.object(request),
            tx.object(kiosk),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}

const prove_rule = async (packageId: string, policy:string, policyCap:string, itemType:string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::item_locked_policy::prove`,
        arguments: [
            tx.object(policy),
            tx.object(policyCap),
            tx.pure("10000", 'u16')
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}

const destroy_and_withdraw = async (policy:string, policyCap:string, itemType:string) => {
    const tx = new TransactionBlock();
    let withdrawn_coin = tx.moveCall({
        target: "0x2::transfer_policy::destroy_and_withdraw",
        arguments: [
            tx.object(policy),
            tx.object(policyCap),
        ],
        typeArguments: [itemType]
    });
    tx.transferObjects([withdrawn_coin], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
   console.log("Add rule digest: ",result.digest);
}


async function main() {
    const packageId = getEnv("PACKAGE"); // nft contract
    const policy = getEnv("TRANSFER_POLICY"); // policy
    const policyCap = getEnv("TRANSFER_POLICY_CAP"); // policy
    const itemType = `${packageId}::nft::Sword`;
    const publisher = getEnv("PUBLISHER");


    // createPolicy(publisher, itemType);
    // add_rule(packageId, policy, policyCap, itemType)
    // add_royalty_rule(packageId, policy, policyCap, itemType)
    // add_royalty_rule(packageId, policy, policyCap, itemType)
    // remove_rule(policy, policyCap, itemType)
    // destroy_and_withdraw(policy, policyCap, itemType)
}
main()