

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { packageId, Kiosk, KioskOwnerCap, Publisher, itemType, TransferPolicyCapId, TransferPolicyId } from '../../utils/packageInfo';

import getExecStuff from '../../utils/execStuff';
const { keypair, client } = getExecStuff();


export async function createPolicy(publihser: any, itemType: any) {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::transfer_policy::default`,
        arguments: [
            tx.object(publihser)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const digest_ = result.digest;
    console.log("Transfer Policy digest: ", result.digest);

    let TransferPolicyId: any;
    let TransferPolicyCapId: any;

    const txn = await client.getTransactionBlock({
        digest: String(digest_),
        options: {
            showEffects: true,
            showInput: false,
            showEvents: false,
            showObjectChanges: true,
            showBalanceChanges: false,
        },
    });
    let output: any;
    output = txn.objectChanges;

    for (let i = 0; i < output.length; i++) {
        const item = output[i];
        if (item.type === 'created') {
            if (item.objectType == `0x2::transfer_policy::TransferPolicy<${itemType}>`) {
                TransferPolicyId = String(item.objectId);
            }
            if (item.objectType == `0x2::transfer_policy::TransferPolicyCap<${itemType}>`) {
                TransferPolicyCapId = String(item.objectId);
            }
        }
    }
    console.log(`TransferPolicyId: ${TransferPolicyId}\n TransferPolicyCapId: ${TransferPolicyCapId}`)

    return { "policyId": TransferPolicyId, "policyCapId": TransferPolicyCapId };
}

export async function add_rule(policyId: any, policyCapId: any, packageId: any, itemType: any) {
    const tx = new TransactionBlock();

    tx.moveCall({
        target: `${packageId}::item_locked_policy::set`,
        arguments: [
            tx.object(policyId),
            tx.object(policyCapId),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log("Add rule digest: ", result.digest);
}

export async function remove_rule() {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::transfer_policy::remove_rule`,
        arguments: [
            tx.object(TransferPolicyId),
            tx.object(TransferPolicyCapId),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log("Add rule digest: ", result.digest);
}


export async function add_royalty_rule(packageId: any, policy: any, policyCap: any, itemType: any) {
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
    console.log("Add rule digest: ", result.digest);
}
export async function prove_is_in_rule(packageId: any, request: any, kiosk: any, itemType: any) {
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
    console.log("Add rule digest: ", result.digest);
}

export async function prove_rule(packageId: any, policy: any, policyCap: any, itemType: any) {
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
    console.log("Add rule digest: ", result.digest);
}


async function main() {
    // const packageId = getEnv("PACKAGE"); // nft contract
    // const policy = getEnv("TRANSFER_POLICY"); // policy
    // const policyCap = getEnv("TRANSFER_POLICY_CAP"); // policy
    // const itemType = `${packageId}::nft::Sword`;
    // const publisher = getEnv("PUBLISHER");
    // createPolicy();
    // add_rule(packageId, policy, policyCap, itemType)
    // add_royalty_rule(packageId, policy, policyCap, itemType)
    // add_royalty_rule(packageId, policy, policyCap, itemType)
    // remove_rule(policy, policyCap, itemType)
}
// main()
