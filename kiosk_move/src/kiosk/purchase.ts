import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
dotenv.config();
export async function purchaseItem(
    sellerKiosk: any,
    nftId: any,
    buyerKiosk: any,
    buyerKioskCap: any,
    policyId: any,
    itemType: any,
    packageId: any,
) {
    console.log("PURCHASING NFT");
    console.log(sellerKiosk, nftId, buyerKiosk, buyerKioskCap, policyId, itemType, packageId);
    const { keypair, client } = getExecStuff();
    const address = "0x50453efa65fa0db11ef59e6ea289fbc2f2c98e3ee76b07834bde25cbb156828c";
    const tx = new TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(100000000)]);
    const coin2 = tx.splitCoins(tx.gas, [tx.pure(1_0_000_000)]);

    const nested_result = tx.moveCall({
        target: `0x02::kiosk::purchase`,
        arguments: [
            tx.object(sellerKiosk),
            tx.pure.id(nftId),
            tx.object(coin),
        ],
        typeArguments: [itemType]
    });

   // lock the item
    tx.moveCall({
        target: `0x02::kiosk::lock`,
        arguments: [
            tx.object(buyerKiosk),
            tx.object(buyerKioskCap),
            tx.object(policyId),
            tx.object(nested_result[0])
        ],
        typeArguments: [itemType]
    });

   //  prove the lock rule
    tx.moveCall({
        target: `${packageId}::item_locked_policy::prove`,
        arguments: [
            nested_result[1],
            tx.object(buyerKiosk),
        ],
        typeArguments: [itemType]
    });

    tx.moveCall({
        target: `0x02::transfer_policy::confirm_request`,
        arguments: [
            tx.object(policyId),
            nested_result[1],
        ],
        typeArguments: [itemType]
    });

    // transfer item publisc
    tx.transferObjects([coin2], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
// purchaseItem();
export async function purchaseItemRoyaltyRule(
    sellerKiosk: any,
    nftId: any,
   // buyerKiosk: any,
    //buyerKioskCap: any,
    policyId: any,
    itemType: any,
    packageId: any,
) {
    console.log("PURCHASING NFT");
    console.log(sellerKiosk, nftId, policyId, itemType, packageId);
    const { keypair, client } = getExecStuff();
    const address = "0x50453efa65fa0db11ef59e6ea289fbc2f2c98e3ee76b07834bde25cbb156828c";
    const tx = new TransactionBlock();
    const coin = tx.splitCoins(tx.gas, [tx.pure(100000000)]);
    const coin2 = tx.splitCoins(tx.gas, [tx.pure(1_0_000_000)]);

    const nested_result = tx.moveCall({
        target: `0x02::kiosk::purchase`,
        arguments: [
            tx.object(sellerKiosk),
            tx.pure.id(nftId),
            tx.object(coin),
        ],
        typeArguments: [itemType]
    });

     tx.moveCall({
         target: `${packageId}::royalty_policy::pay`,
         arguments: [
             tx.object(policyId),
             nested_result[1],
             coin2,
         ],
         typeArguments: [itemType]
     });

    // confirm the request
    tx.moveCall({
        target: `0x02::transfer_policy::confirm_request`,
        arguments: [
            tx.object(policyId),
            nested_result[1],
        ],
        typeArguments: [itemType]
    });

    tx.moveCall({ 
        target: `0x02::transfer::public_transfer`,
        arguments: [
            nested_result[0],
            tx.pure.address(address),
        ],
        typeArguments: [itemType]
    });

    // transfer item publisc
    tx.transferObjects([coin2], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}